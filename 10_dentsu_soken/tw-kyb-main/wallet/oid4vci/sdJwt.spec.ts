import { describe, it, expect } from 'vitest';
import * as u8a from 'uint8arrays';
import dotenv from 'dotenv';
import path from 'path';

import { es256 } from '../jwt-alg';
import { decodeSdJwt, decodeJwt, decodeDisclosure } from './sdJwt';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

const SD_JWT = process.env.SD_JWT || '';
const X = process.env.X || '';
const Y = process.env.Y || '';
const ISSUER = process.env.ISSUER || '';

describe('sdJwt', () => {
  it('decodeJwt', () => {
    const [rawJwt, ..._] = SD_JWT.split('~');

    const { jwt, msgHash, signature, parsedHeader, parsedPayload } =
      decodeJwt(rawJwt);
    const publicKey = es256.publicKeyFromXY({ x: X, y: Y });

    expect(jwt).toEqual(rawJwt);
    expect(msgHash.length).toEqual(32);
    expect(signature.length).toEqual(64);
    expect(es256.verify({ publicKey, msgHash, signature })).toBeTruthy;
    expect(parsedHeader).toEqual({ kid: '1', typ: 'vc+sd-jwt', alg: 'ES256' });
    expect(parsedPayload._sd.length).toBeGreaterThan(0);
    expect(parsedPayload.vct).toEqual(
      'https://credentials.example.com/identity_credential',
    );
    expect(parsedPayload._sd_alg).toEqual('sha-256');
    expect(parsedPayload.iss).toEqual(ISSUER);
    expect(parsedPayload.cnf.jwk).toBeDefined();
    expect(parsedPayload.iat).toBeGreaterThanOrEqual(1708333972);
  });

  it('decodeDisclosure', () => {
    const [jwt, ...disclosures] = SD_JWT.split('~');
    const decodedJwt = decodeJwt(jwt);
    const decodedDisclosure = decodeDisclosure(disclosures[0]);

    expect(decodedDisclosure.disclosure).toEqual(disclosures[0]);
    expect(
      decodedJwt.parsedPayload._sd.indexOf(decodedDisclosure.digest),
    ).toBeGreaterThanOrEqual(0);
    expect(decodedDisclosure.parsedDisclosure.length).toEqual(3);
  });

  it('decodeCredential', () => {
    const [jwt, ...disclosures] = SD_JWT.split('~');
    if (disclosures[disclosures.length - 1].length == 0) {
      disclosures.length -= 1;
    }

    const { sdJwt, decodedJwt, decodedDisclosures } = decodeSdJwt(SD_JWT);

    expect(sdJwt).toEqual(SD_JWT);
    expect(decodedJwt).toEqual(decodeJwt(jwt));
    expect(decodedDisclosures[0]).toEqual(decodeDisclosure(disclosures[0]));
    expect(decodedDisclosures.length).toEqual(disclosures.length);
  });
});
