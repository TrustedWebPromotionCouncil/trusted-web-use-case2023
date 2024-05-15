import { describe, it, expect } from 'vitest';
import path from 'path';
import dotenv from 'dotenv';

import { fetchOpenidConfiguration } from './openidConfiguration';
import { fetch4PreAuthorizedCodeFlow } from './tokenEndpoint';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

const ISSUER = process.env.ISSUER || '';
const PRE_AUTHORIZED_CODE = process.env.PRE_AUTHORIZED_CODE || '';
const CLIENT_ID = process.env.CLIENT_ID || '';
const RUN = process.env.RUN || '';

describe('tokenEndpoint', () => {
  it.runIf(RUN == 'fetch4PreAuthorizedCodeFlow')(
    'fetch4PreAuthorizedCodeFlow',
    async () => {
      const config = await fetchOpenidConfiguration(ISSUER);
      const res = await fetch4PreAuthorizedCodeFlow({
        tokenEndpoint: config.token_endpoint,
        clientId: CLIENT_ID,
        preAuthorizedCode: PRE_AUTHORIZED_CODE,
      });
      console.log(res);
      expect(res.access_token).toBeDefined();
      expect(res.c_nonce).toBeDefined();
    },
    20000,
  );
});
