import { describe, it, expect } from 'vitest';
import path from 'path';
import dotenv from 'dotenv';
import { getPubKey, sign } from './tECDSA';
import sha256 from 'fast-sha256';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

const msg = 'LPJNul-wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ';

const idToken = process.env.ID_TOKEN || '';
const RUN = process.env.RUN || '';

describe('tECDSA', () => {
  it.runIf(RUN == 'tECDSA')(
    'getPubKey should work',
    async () => {
      const pub_key = await getPubKey(idToken);

      expect(pub_key).toBeDefined();
    },
    100000,
  );

  it.runIf(RUN == 'tECDSA')('sign should work', async () => {
    const signature = await sign(
      idToken,
      sha256(new TextEncoder().encode(msg)),
    );

    expect(signature).toBeDefined();
  });
}, 100000);
