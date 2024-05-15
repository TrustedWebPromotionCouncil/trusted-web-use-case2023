import { describe, it, expect } from 'vitest';
import elliptic from 'elliptic';
import sha256 from 'fast-sha256';
import * as u8a from 'uint8arrays';
import * as ecdsa from './ecdsa';

const secp256k1 = new elliptic.ec('secp256k1');
const p256 = new elliptic.ec('p256');

const testGenKeyPair = (ec: elliptic.ec) => {
  const keyPair = ecdsa.genKeyPair(ec);

  expect(keyPair.publicKey.length).toEqual(33);
  expect(keyPair.privateKey.length).toEqual(32);
};

const testSignAndVerify = (ec: elliptic.ec) => {
  const { privateKey, publicKey } = ecdsa.genKeyPair(ec);
  const msgHash = sha256(new TextEncoder().encode('hello'));
  const signature = ecdsa.sign(ec, { privateKey, msgHash });

  expect(ecdsa.verify(ec, { publicKey, msgHash, signature })).toBeTruthy;
};

const testXYFromPublicKey = (ec: elliptic.ec) => {
  const publicKey = ecdsa.genKeyPair(ec).publicKey;
  const { x, y } = ecdsa.xyFromPublicKey(ec, publicKey);

  const xU8a = u8a.fromString(x, 'base64url');
  const yU8a = u8a.fromString(y, 'base64url');
  const isOdd = yU8a[yU8a.length - 1] & 1;
  const publicKey2 = new Uint8Array(33);
  publicKey2[0] = isOdd ? 3 : 2;
  publicKey2.set(xU8a, 1);
  expect(publicKey).toEqual(publicKey2);
};

const testXYDFromPrivateKey = (ec: elliptic.ec) => {
  const { publicKey, privateKey } = ecdsa.genKeyPair(ec);
  const { x, y, d } = ecdsa.xydFromPrivateKey(ec, privateKey);

  const xU8a = u8a.fromString(x, 'base64url');
  const yU8a = u8a.fromString(y, 'base64url');
  const isOdd = yU8a[yU8a.length - 1] & 1;
  const publicKey2 = new Uint8Array(33);
  publicKey2[0] = isOdd ? 3 : 2;
  publicKey2.set(xU8a, 1);
  const privateKey2 = u8a.fromString(d!, 'base64url');

  expect(publicKey).toEqual(publicKey2);
  expect(privateKey).toEqual(privateKey2);
};

const testPublicKeyFromXY = (ec: elliptic.ec) => {
  const { publicKey } = ecdsa.genKeyPair(ec);
  const xy = ecdsa.xyFromPublicKey(ec, publicKey);
  const publicKey2 = ecdsa.publicKeyFromXY(ec, xy);

  expect(publicKey).toEqual(publicKey2);
};

describe('ecdsa', () => {
  it('genKeyPair', () => {
    testGenKeyPair(secp256k1);
    testGenKeyPair(p256);
  });

  it('sign & verify', () => {
    testSignAndVerify(secp256k1);
    testSignAndVerify(p256);
  });

  it('xyFromPublicKey', () => {
    testXYFromPublicKey(secp256k1);
    testXYFromPublicKey(p256);
  });

  it('xydFromPrivateKey', () => {
    testXYDFromPrivateKey(secp256k1);
    testXYDFromPrivateKey(p256);
  });

  it('publicKeyFromXY', () => {
    testPublicKeyFromXY(secp256k1);
    testPublicKeyFromXY(p256);
  });
});
