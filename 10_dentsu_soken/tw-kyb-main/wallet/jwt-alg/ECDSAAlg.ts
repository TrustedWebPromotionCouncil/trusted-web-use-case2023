import elliptic from 'elliptic';
import {
  Alg,
  KeyPair,
  PublicJwk,
  PrivateJwk,
  PublicKeyParams,
  SignParams,
  VerifyParams,
} from './types';
import * as ecdsa from './ecdsa';

type ConstructorParams = {
  ec: elliptic.ec;
  alg: string;
  kty: string;
  crv: string;
};

export class ECDSAAlg implements Alg {
  #ec: elliptic.ec;
  #alg: string;
  #kty: string;
  #crv: string;

  constructor({ ec, alg, kty, crv }: ConstructorParams) {
    this.#ec = ec;
    this.#alg = alg;
    this.#kty = kty;
    this.#crv = crv;
  }

  alg(): string {
    return this.#alg;
  }

  kty(): string {
    return this.#kty;
  }

  crv(): string {
    return this.#crv;
  }

  genKeyPair(): KeyPair {
    return ecdsa.genKeyPair(this.#ec);
  }

  sign({ privateKey, msgHash }: SignParams): Uint8Array {
    return ecdsa.sign(this.#ec, { privateKey, msgHash });
  }

  verify({ publicKey, msgHash, signature }: VerifyParams): boolean {
    return ecdsa.verify(this.#ec, { publicKey, msgHash, signature });
  }

  jwkFromPublicKey(publicKey: Uint8Array): PublicJwk {
    const { x, y } = ecdsa.xyFromPublicKey(this.#ec, publicKey);
    return {
      alg: this.#alg,
      kty: this.#kty,
      crv: this.#crv,
      x,
      y,
    };
  }

  jwkFromPrivateKey(privateKey: Uint8Array): PrivateJwk {
    const { x, y, d } = ecdsa.xydFromPrivateKey(this.#ec, privateKey);
    return {
      alg: this.#alg,
      kty: this.#kty,
      crv: this.#crv,
      x,
      y,
      d,
    };
  }

  publicKeyFromXY(xy: PublicKeyParams): Uint8Array {
    return ecdsa.publicKeyFromXY(this.#ec, xy);
  }

  isTargetJwk(jwk: PublicJwk): boolean {
    return jwk.kty == this.#kty && jwk.crv == this.#crv;
  }
}

export const es256 = new ECDSAAlg({
  ec: new elliptic.ec('p256'),
  alg: 'ES256',
  kty: 'EC',
  crv: 'P-256',
});

export const es256k = new ECDSAAlg({
  ec: new elliptic.ec('secp256k1'),
  alg: 'ES256K',
  kty: 'EC',
  crv: 'secp256k1',
});
