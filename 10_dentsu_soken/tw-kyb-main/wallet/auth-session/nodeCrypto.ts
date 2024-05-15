import * as NodejsCrypto from 'node:crypto';

import * as base64 from 'base64-js';

import { Crypto } from './crypto';

export function textEncodeLite(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);

  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}

class NodeCrypto implements Crypto {
  getRandomBytes(size: number): Uint8Array {
    const input = new Uint8Array(size);
    return NodejsCrypto.getRandomValues(input);
  }

  sha256Async(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      NodejsCrypto.subtle.digest('SHA-256', textEncodeLite(code)).then(
        (buffer) => {
          return resolve(base64.fromByteArray(new Uint8Array(buffer)));
        },
        (error) => reject(error),
      );
    });
  }
}

export const nodeCrypto = new NodeCrypto();
