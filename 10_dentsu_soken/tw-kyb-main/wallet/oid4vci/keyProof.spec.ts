import { describe, it, expect } from 'vitest';
import * as u8a from 'uint8arrays';
import dotenv from 'dotenv';
import path from 'path';

import { es256k } from '../jwt-alg';
import { buildHeader, buildPayload, buildHeaderAndPayload } from './keyProof';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

const CLIENT_ID = process.env.CLIENT_ID || '';
const ISSUER = process.env.ISSUER || '';

describe('keyProof', () => {
  it('buildHeader', () => {
    const { publicKey } = es256k.genKeyPair();
    const headerBase64Url = buildHeader({ alg: es256k, publicKey });
    const header = JSON.parse(
      u8a.toString(u8a.fromString(headerBase64Url, 'base64url'), 'utf-8'),
    );
    //console.log(header);
    expect(header.typ).toEqual('openid4vci-proof+jwt');
    expect(header.alg).toEqual('ES256K');
    expect(header.jwk).toEqual(es256k.jwkFromPublicKey(publicKey));
  });

  it('buildPayload', () => {
    const nonce = 'nonce';
    const payloadBase64Url = buildPayload({
      clientId: CLIENT_ID,
      issuer: ISSUER,
      nonce,
    });
    const payload = JSON.parse(
      u8a.toString(u8a.fromString(payloadBase64Url, 'base64url'), 'utf-8'),
    );
    //console.log('payload:', payload);
    expect(payload.aud).toEqual(ISSUER);
    expect(payload.iat).toBeDefined();
    expect(payload.iss).toEqual(CLIENT_ID);
    expect(payload.nonce).toEqual(nonce);
  });

  it('buildHeaderAndPayload', () => {
    const { publicKey } = es256k.genKeyPair();
    const nonce = 'nonce';
    const headerAndPayloadBase64Url = buildHeaderAndPayload({
      alg: es256k,
      publicKey,
      clientId: CLIENT_ID,
      issuer: ISSUER,
      nonce,
    });
    const [headerBase64Url, payloadBase64Url] =
      headerAndPayloadBase64Url.split('.');
    //console.log('header base64url:', headerBase64Url);
    //console.log('payload base64url:', payloadBase64Url);

    const header = JSON.parse(
      u8a.toString(u8a.fromString(headerBase64Url, 'base64url'), 'utf-8'),
    );
    //console.log('header:', header);
    expect(header.typ).toEqual('openid4vci-proof+jwt');
    expect(header.alg).toEqual('ES256K');
    expect(header.jwk).toEqual(es256k.jwkFromPublicKey(publicKey));

    const payload = JSON.parse(
      u8a.toString(u8a.fromString(payloadBase64Url, 'base64url'), 'utf-8'),
    );
    //console.log('payload:', payload);
    expect(payload.aud).toEqual(ISSUER);
    expect(payload.iat).toBeDefined();
    expect(payload.iss).toEqual(CLIENT_ID);
    expect(payload.nonce).toEqual(nonce);
  });
});
