import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';
import { findClient } from './datastore/ClinetStore';
import { createAuthSession } from './datastore/AuthSession';
import { findIssuerState } from './datastore/IssuerState';

const pageUri = 'https://tw-isid-test.web.app/authorize';

export const authorization = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response) => {
    logger.log('method:', request.method);
    if (request.method !== 'GET') {
      response.status(400).send('error=The medhod should be GET');
      return;
    }
    const clientId = request.query.client_id;
    const redirectUri = request.query.redirect_uri;
    const responseType = request.query.response_type;
    const state = request.query.state;
    const authorizationDetails = request.query.authorization_details;
    const codeChallenge = request.query.code_challenge;
    const codeChallengeMethod = request.query.code_challenge_method;
    const issuerState = request.query.issuer_state;

    logger.log('client_id:', clientId);
    if (typeof clientId !== 'string' || !findClient(clientId)) {
      response.status(400).send('error=client_id is wrong');
    }
    logger.log('redirect_uri:', redirectUri);
    if (!redirectUri) {
      response.status(400).send('error=redirect_uri is wrong');
    }
    logger.log('response_type:', responseType);
    if (responseType !== 'code') {
      response.status(400).send('error=response_type is wrong');
    }
    if (
      !!issuerState &&
      (typeof issuerState !== 'string' || !findIssuerState(issuerState))
    ) {
      response.status(400).send('error=issuer_state is wrong');
    }

    try {
      const session = createAuthSession({
        sessionId: '',
        clientId: typeof clientId === 'string' ? clientId : '',
        authorizationDetails:
          typeof authorizationDetails === 'string' ? authorizationDetails : '',
        redirectUri: typeof redirectUri === 'string' ? redirectUri : '',
        state: typeof state === 'string' ? state : '',
        codeChallenge: typeof codeChallenge === 'string' ? codeChallenge : '',
        codeChallengeMethod:
          typeof codeChallengeMethod === 'string' ? codeChallengeMethod : '',
      });

      response.redirect(`${pageUri}?sessionId=${session.sessionId}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      response.status(400).send(`error=${e.message}`);
    }
  });
