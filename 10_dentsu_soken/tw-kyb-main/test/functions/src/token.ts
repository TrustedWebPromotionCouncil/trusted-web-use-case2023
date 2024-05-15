import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';
import { findAuthCode } from './datastore/AuthCodeStore';
import { verifyPKCE } from './utils/pkce';
import { createAccessToken } from './datastore/AccessTokenStore';
import { createNonce } from './datastore/Nonce';
import { findClient } from './datastore/ClinetStore';
import { findPreAuthCode } from './datastore/PreAuthCodeStore';

type AuthCodeParams = {
  grant_type: 'authorization_code';
  client_id: string;
  code: string;
  code_verifier: string;
  redirect_uri: string;
};

type PreAuthCodeParams = {
  grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code';
  client_id: string;
  'pre-authorized_code': string;
  user_pin: string;
};

type ResponseParams = {
  access_token: string;
  token_type: string;
  issued_at: number;
  expires_in: number;
  c_nonce: string;
  c_nonce_expires_in: number;
};

export const token = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    logger.log('method:', request.method);
    if (request.method !== 'POST') {
      response.status(400).json({ error: 'The medhod should be POST' });
      return;
    }
    try {
      logger.log('body:', request.body);
      const body: AuthCodeParams | PreAuthCodeParams = request.body;
      if (
        body.grant_type !== 'authorization_code' &&
        body.grant_type !==
          'urn:ietf:params:oauth:grant-type:pre-authorized_code'
      ) {
        response.status(400).send('error=invalid_grant');
        return;
      }
      logger.log('grant_type:', body.grant_type);
      if (body.grant_type === 'authorization_code') {
        if (
          !body ||
          !(
            body.client_id &&
            body.code &&
            body.code_verifier &&
            body.grant_type &&
            body.redirect_uri
          )
        ) {
          response.status(400).send('error=invalid_grant');
          return;
        }
        const authCode = findAuthCode(body.code);
        if (!authCode || authCode.expiresAt < Date.now()) {
          response.status(400).send('error=invalid_grant');
          return;
        }
        if (authCode.redirectUri !== body.redirect_uri) {
          response.status(400).send('error=invalid_grant');
          return;
        }
        if (authCode.clientId !== body.client_id) {
          response.status(400).send('error=invalid_grant');
          return;
        }
        if (!(await verifyPKCE(authCode.value, body.code_verifier))) {
          response.status(400).send('error=invalid_grant');
          return;
        }
        const { accessToken, issuedAt } = createAccessToken(authCode);
        const nonce = createNonce(accessToken.value);
        const responseParams: ResponseParams = {
          access_token: accessToken.value,
          token_type: 'bearer',
          issued_at: issuedAt,
          expires_in: accessToken.expiresIn,
          c_nonce: nonce.cNonce,
          c_nonce_expires_in: nonce.cNonceExpiresIn,
        };
        response.json(responseParams);
        return;
      }

      if (
        body.grant_type !==
        'urn:ietf:params:oauth:grant-type:pre-authorized_code'
      ) {
        response.status(400).send('error=invalid_grant');
        return;
      }
      if (!body || !(body.client_id && body['pre-authorized_code'])) {
        response.status(400).send('error=invalid_grant');
        return;
      }

      logger.log('client_id:', body.client_id);
      if (typeof body.client_id !== 'string' || !findClient(body.client_id)) {
        response.status(400).send('error=invalid_grant');
        return;
      }

      logger.log('pre-authorized_code:', body['pre-authorized_code']);
      if (
        !findPreAuthCode(
          body['pre-authorized_code'],
          'user_pin' in body,
          body.user_pin
        )
      ) {
        response.status(400).send('error=invalid_grant');
        return;
      }
      const { accessToken, issuedAt } = createAccessToken({
        clientId: body.client_id,
      });
      const nonce = createNonce(accessToken.value);
      const responseParams: ResponseParams = {
        access_token: accessToken.value,
        token_type: 'bearer',
        issued_at: issuedAt,
        expires_in: accessToken.expiresIn,
        c_nonce: nonce.cNonce,
        c_nonce_expires_in: nonce.cNonceExpiresIn,
      };
      response.json(responseParams);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      logger.error('error:', e.message);
      response.status(400).send(`error=${e.message}`);
    }
  });
