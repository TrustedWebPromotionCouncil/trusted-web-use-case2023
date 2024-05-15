import elliptic from 'elliptic';
import * as u8a from 'uint8arrays';
import {
  KeyPair,
  PublicKeyParams,
  PrivateKeyParams,
  SignParams,
  VerifyParams,
} from './types';

export const genKeyPair = (ec: elliptic.ec): KeyPair => {
  const keyPair = ec.genKeyPair();
  const privateKey = u8a.fromString(keyPair.getPrivate('hex'), 'hex');
  const publicKey = Uint8Array.from(keyPair.getPublic().encodeCompressed());

  return { publicKey, privateKey };
};

export const xyFromPublicKey = (
  ec: elliptic.ec,
  publicKey: Uint8Array,
): PublicKeyParams => {
  const key = ec.keyFromPublic(publicKey);
  const pub = key.getPublic();
  const x = u8a.toString(
    Uint8Array.from(pub.getX().toArray('be', 32)),
    'base64url',
  );
  const y = u8a.toString(
    Uint8Array.from(pub.getY().toArray('be', 32)),
    'base64url',
  );

  return { x, y };
};

export const xydFromPrivateKey = (
  ec: elliptic.ec,
  privateKey: Uint8Array,
): PrivateKeyParams => {
  const key = ec.keyFromPrivate(privateKey);
  const pub = key.getPublic();
  const x = u8a.toString(
    Uint8Array.from(pub.getX().toArray('be', 32)),
    'base64url',
  );
  const y = u8a.toString(
    Uint8Array.from(pub.getY().toArray('be', 32)),
    'base64url',
  );
  const d = u8a.toString(privateKey, 'base64url');

  return { x, y, d };
};

export const publicKeyFromXY = (
  ec: elliptic.ec,
  { x, y }: PublicKeyParams,
): Uint8Array => {
  const xHex = u8a.toString(u8a.fromString(x, 'base64url'), 'hex');
  const yHex = u8a.toString(u8a.fromString(y, 'base64url'), 'hex');
  const key = ec.keyFromPublic({ x: xHex, y: yHex });

  return Uint8Array.from(key.getPublic().encodeCompressed());
};

export const sign = (
  ec: elliptic.ec,
  { privateKey, msgHash }: SignParams,
): Uint8Array => {
  const key = ec.keyFromPrivate(privateKey);
  const sig = key.sign(msgHash);
  const r = Uint8Array.from(sig.r.toArray('be', 32));
  const s = Uint8Array.from(sig.s.toArray('be', 32));
  const signature = new Uint8Array(r.length + s.length);
  signature.set(r, 0);
  signature.set(s, r.length);

  return signature;
};

export const verify = (
  ec: elliptic.ec,
  { publicKey, msgHash, signature }: VerifyParams,
): boolean => {
  const key = ec.keyFromPublic(publicKey);
  const mid = signature.length / 2;
  const r = signature.slice(0, mid);
  const s = signature.slice(mid);

  return key.verify(msgHash, { r, s });
};
