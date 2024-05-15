import { describe, it, expect } from 'vitest';
import path from 'path';
import dotenv from 'dotenv';
import sha256 from 'fast-sha256';
import * as u8a from 'uint8arrays';

import { fetchOpenidConfiguration } from './openidConfiguration';
import { fetchIssuerMetadata } from './issuerMetadata';
import { fetch4PreAuthorizedCodeFlow } from './tokenEndpoint';
import { fetch4VcSdJwt } from './credentialEndpoint';
import { es256k } from '../jwt-alg';
import { buildHeaderAndPayload } from './keyProof';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

const ISSUER = process.env.ISSUER || '';
const PRE_AUTHORIZED_CODE = process.env.PRE_AUTHORIZED_CODE || '';
const CLIENT_ID = process.env.CLIENT_ID || '';
const RUN = process.env.RUN || '';

describe('credentialEndpoint', () => {
  it.runIf(RUN == 'fetch4VcSdJwt')(
    'fetch4VcSdJwt',
    async () => {
      const config = await fetchOpenidConfiguration(ISSUER);
      const tokenResponse = await fetch4PreAuthorizedCodeFlow({
        tokenEndpoint: config.token_endpoint,
        clientId: CLIENT_ID,
        preAuthorizedCode: PRE_AUTHORIZED_CODE,
      });

      const issuerMetadata = await fetchIssuerMetadata(ISSUER);
      const { privateKey, publicKey } = es256k.genKeyPair();
      const headerAndPayloadBase64Url = buildHeaderAndPayload({
        alg: es256k,
        publicKey,
        issuer: ISSUER,
        clientId: CLIENT_ID,
        nonce: tokenResponse.c_nonce,
      });
      const msgHash = sha256(
        new TextEncoder().encode(headerAndPayloadBase64Url),
      );
      const signature = es256k.sign({ privateKey, msgHash });
      const signatureBase64Url = u8a.toString(signature, 'base64url');
      const keyProofJwt = `${headerAndPayloadBase64Url}.${signatureBase64Url}`;
      const credentialConfigurationId = 'IdentityCredential';
      const vct = issuerMetadata.credential_configurations_supported[
        credentialConfigurationId
      ].vct as string;
      const credentialResponse = await fetch4VcSdJwt({
        credentialEndpoint: issuerMetadata.credential_endpoint,
        accessToken: tokenResponse.access_token,
        vct,
        keyProofJwt,
      });
      console.log(credentialResponse);
    },
    20000,
  );
});
