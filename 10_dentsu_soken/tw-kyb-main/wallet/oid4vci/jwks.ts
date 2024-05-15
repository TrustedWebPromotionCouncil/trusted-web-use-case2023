import { PublicJwk } from '../jwt-alg/types';
import { JwksResponse, JwtVcIssuerResponse } from './types';
import { Alg } from '../jwt-alg/types';
import { getTargetAlg } from '../jwt-alg';

export const fetchJwks = async (issuer: string): Promise<PublicJwk[]> => {
  const res = await fetch(`${issuer}/.well-known/jwt-vc-issuer`);
  const jwtVcIssuerResponse: JwtVcIssuerResponse = await res.json();

  if (jwtVcIssuerResponse.issuer != issuer) {
    throw new Error(`${jwtVcIssuerResponse.issuer} must be ${issuer}`);
  }

  if (jwtVcIssuerResponse.jwks_uri) {
    const res = await fetch(jwtVcIssuerResponse.jwks_uri);
    const jwksResponse: JwksResponse = await res.json();

    return jwksResponse.keys;
  }

  return jwtVcIssuerResponse.jwks!.keys;
};

export const getPublicKeyAndAlg = (
  keys: PublicJwk[],
  kid: string,
): { publicKey: Uint8Array; alg: Alg } => {
  const jwk = keys.find((jwk) => jwk.kid == kid);

  if (jwk) {
    const alg = getTargetAlg(jwk);
    const publicKey = alg.publicKeyFromXY({ x: jwk.x, y: jwk.y });

    return { publicKey, alg };
  }

  throw new Error(`JWK corresponding to {kid: ${kid}} not found`);
};
