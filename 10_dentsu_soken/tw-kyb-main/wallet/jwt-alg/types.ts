export type KeyPair = {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
};

export type PublicKeyParams = {
  x: string;
  y: string;
};

export type PrivateKeyParams = PublicKeyParams & {
  d: string;
};

type CommonJwk = {
  alg: string;
  kty: string;
  crv: string;
  kid?: string;
};

export type PublicJwk = CommonJwk & PublicKeyParams;
export type PrivateJwk = CommonJwk & PrivateKeyParams;

export type SignParams = {
  privateKey: Uint8Array;
  msgHash: Uint8Array;
};

export type VerifyParams = {
  publicKey: Uint8Array;
  msgHash: Uint8Array;
  signature: Uint8Array;
};

export interface Signer {
  sign: ({ privateKey, msgHash }: SignParams) => Uint8Array;
}

export interface Alg extends Signer {
  alg: () => string;
  crv: () => string;
  kty: () => string;

  genKeyPair: () => KeyPair;

  //sign: ({ privateKey, msgHash }: SignParams) => Uint8Array;

  verify: ({ publicKey, msgHash, signature }: VerifyParams) => boolean;

  jwkFromPublicKey: (publicKey: Uint8Array) => PublicJwk;

  jwkFromPrivateKey: (privateKey: Uint8Array) => PrivateJwk;

  publicKeyFromXY: ({ x, y }: PublicKeyParams) => Uint8Array;

  isTargetJwk: (jwk: PublicJwk) => boolean;
}
