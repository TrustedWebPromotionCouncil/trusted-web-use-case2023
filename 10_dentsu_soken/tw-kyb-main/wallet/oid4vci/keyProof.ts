import { Alg } from '../jwt-alg';
import * as u8a from 'uint8arrays';
import { getCurrentTimeInSeconds } from '../utils/now';

type BuildHeaderArgs = {
  alg: Alg;
  publicKey: Uint8Array;
};

export const buildHeader = ({ alg, publicKey }: BuildHeaderArgs): string => {
  const header = {
    typ: 'openid4vci-proof+jwt',
    alg: alg.alg(),
    jwk: alg.jwkFromPublicKey(publicKey),
  };
  return u8a.toString(u8a.fromString(JSON.stringify(header)), 'base64url');
};

type BuildPayloadArgs = {
  clientId: string;
  issuer: string;
  nonce: string;
};

export const buildPayload = ({
  clientId,
  issuer,
  nonce,
}: BuildPayloadArgs): string => {
  const payload = {
    aud: issuer,
    iat: getCurrentTimeInSeconds(),
    iss: clientId,
    nonce,
  };
  return u8a.toString(u8a.fromString(JSON.stringify(payload)), 'base64url');
};

export const buildHeaderAndPayload = (
  arg: BuildHeaderArgs & BuildPayloadArgs,
): string => {
  const header = buildHeader(arg);
  const payload = buildPayload(arg);

  return `${header}.${payload}`;
};
