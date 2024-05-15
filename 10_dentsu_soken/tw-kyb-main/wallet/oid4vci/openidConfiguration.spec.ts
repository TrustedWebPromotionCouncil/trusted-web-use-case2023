import { describe, it, expect } from 'vitest';
import path from 'path';
import dotenv from 'dotenv';

import { fetchOpenidConfiguration } from './openidConfiguration';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

const ISSUER = process.env.ISSUER || '';
const RUN = process.env.RUN || '';

describe('openidConfiguration', () => {
  it.runIf(RUN == 'fetchOpenidConfiguration')(
    'fetchOpenidConfiguration',
    async () => {
      const config = await fetchOpenidConfiguration(ISSUER);
      //console.log(config);
      expect(config.issuer).toEqual(ISSUER);
      expect(config.authorization_endpoint).toEqual(
        `${ISSUER}/api/authorization`,
      );
      expect(config.token_endpoint).toEqual(`${ISSUER}/api/token`);
      expect(config.pushed_authorization_request_endpoint).toEqual(
        `${ISSUER}/api/par`,
      );
    },
    20000,
  );
});
