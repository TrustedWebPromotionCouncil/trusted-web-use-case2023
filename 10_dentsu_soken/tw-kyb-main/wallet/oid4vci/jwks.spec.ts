import { describe, it, expect } from 'vitest';
import path from 'path';
import dotenv from 'dotenv';

import { fetchJwks, getPublicKeyAndAlg } from './jwks';
import { PublicJwk } from '../jwt-alg/types';
import { es256 } from '../jwt-alg';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

const ISSUER = process.env.ISSUER || '';
const X = process.env.X || '';
const Y = process.env.Y || '';
const RUN = process.env.RUN || '';

describe('jwks', () => {
  it.runIf(RUN == 'fetchJwks')(
    'fetchJwks',
    async () => {
      const jwks = await fetchJwks(ISSUER);
      console.log(jwks);
      expect(jwks.length).toEqual(1);
      const jwk = jwks[0];
      expect(jwk).toEqual({
        alg: 'ES256',
        kty: 'EC',
        crv: 'P-256',
        kid: '1',
        x: X,
        y: Y,
      });
    },
    20000,
  );

  it('genPublicKeyAndAlg', () => {
    const keys: PublicJwk[] = [
      {
        alg: 'ES256',
        kty: 'EC',
        crv: 'P-256',
        kid: '1',
        x: X,
        y: Y,
      },
    ];
    const { publicKey, alg } = getPublicKeyAndAlg(keys, '1');

    expect(publicKey).toBeDefined();
    expect(alg).toEqual(es256);

    expect(() => getPublicKeyAndAlg(keys, 'x')).toThrow(
      'JWK corresponding to {kid: x} not found',
    );
  });
});
