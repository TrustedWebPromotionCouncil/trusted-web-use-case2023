import { Alg, PublicJwk } from './types';
import { es256k, es256 } from './ECDSAAlg';

export { es256k, es256 } from './ECDSAAlg';

export { Alg, Signer } from './types';

export const algs: Alg[] = [es256, es256k];

export const getTargetAlg = (jwk: PublicJwk): Alg => {
  const target = algs.find((alg) => alg.isTargetJwk(jwk));

  if (!target) {
    throw new Error(
      `Alg corresponding to {kty: ${jwk.kty}, crv: ${jwk.crv}} not found`,
    );
  }

  return target;
};
