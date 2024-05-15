import { describe, it, expect } from 'vitest';

import { getTargetAlg, es256, es256k } from '.';

describe('index', () => {
  it('getTargetAlg', () => {
    const { publicKey: es256PublicKey } = es256.genKeyPair();
    const { publicKey: es256kPublicKey } = es256k.genKeyPair();
    const es256Jwk = es256.jwkFromPublicKey(es256PublicKey);
    const es256kJwk = es256k.jwkFromPublicKey(es256kPublicKey);
    const dummyJwk = {
      alg: 'x',
      kty: 'x',
      crv: 'x',
      x: 'x',
      y: 'x',
    };

    expect(getTargetAlg(es256Jwk)).toEqual(es256);
    expect(getTargetAlg(es256kJwk)).toEqual(es256k);
    expect(() => getTargetAlg(dummyJwk)).toThrow(
      'Alg corresponding to {kty: x, crv: x} not found',
    );
  });
});
