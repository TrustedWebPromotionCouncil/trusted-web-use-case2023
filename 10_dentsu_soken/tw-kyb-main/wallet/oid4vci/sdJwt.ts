import * as u8a from 'uint8arrays';
import sha256 from 'fast-sha256';
import { DecodedSdJwt, DecodedJwt, DecodedDisclosure } from './types';

export const decodeSdJwt = (sdJwt: string): DecodedSdJwt => {
  const [jwt, ...disclosures] = sdJwt.split('~');
  if (disclosures[disclosures.length - 1].length == 0) {
    disclosures.length -= 1;
  }

  const decodedSdJwt: DecodedSdJwt = {
    sdJwt,
    decodedJwt: decodeJwt(jwt),
    decodedDisclosures: disclosures.map((d) => decodeDisclosure(d)),
  };

  return decodedSdJwt;
};

export const decodeJwt = (jwt: string): DecodedJwt => {
  const [headerBase64Url, payloadBase64Url, signatureBase64Url] =
    jwt.split('.');
  const msgHash = sha256(
    u8a.fromString(`${signatureBase64Url}.${payloadBase64Url}`, 'utf-8'),
  );
  const signature = u8a.fromString(signatureBase64Url, 'base64url');
  const parsedHeader = JSON.parse(
    u8a.toString(u8a.fromString(headerBase64Url, 'base64url'), 'utf-8'),
  );
  const parsedPayload = JSON.parse(
    u8a.toString(u8a.fromString(payloadBase64Url, 'base64url'), 'utf-8'),
  );

  const decodedJwt: DecodedJwt = {
    jwt,
    msgHash,
    signature,
    parsedHeader,
    parsedPayload,
  };

  return decodedJwt;
};

export const decodeDisclosure = (disclosure: string): DecodedDisclosure => {
  const disclosureU8a = u8a.fromString(disclosure, 'base64url');
  const digest = u8a.toString(
    sha256(u8a.fromString(disclosure, 'utf-8')),
    'base64url',
  );
  const disclosureStr = u8a.toString(disclosureU8a, 'utf-8');
  const parsed = JSON.parse(disclosureStr);

  const decodedDisclosure: DecodedDisclosure = {
    disclosure,
    digest,
    parsedDisclosure: parsed,
  };

  return decodedDisclosure;
};

// export const verifyDecodedJwt = (decodedJwt: DecodedJwt, keys: PublicJwk[]) => {
//   const { typ, alg, kid } = decodedJwt.parsedHeader;
// };

// export const verifyDecodedSdJwt = ({decodedJwt, decodedDisclosures}: DecodedSdJwt, keys: PublicJwk[]): boolean => {
//   const
// }
