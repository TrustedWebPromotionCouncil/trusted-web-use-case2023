import { findPKCE } from '../datastore/PKCEStore';
import * as NodejsCrypto from 'node:crypto';
import * as base64 from 'base64-js';

const convertToUrlSafeString = (b64: string): string => {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const textEncodeLite = (str: string) => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);

  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
};

const sha256Async = (code: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    NodejsCrypto.subtle.digest('SHA-256', textEncodeLite(code)).then(
      (buffer) => {
        return resolve(base64.fromByteArray(new Uint8Array(buffer)));
      },
      (error) => reject(error)
    );
  });
};

export const verifyPKCE = async (authCode: string, codeVerifier: string) => {
  const PKCE = findPKCE(authCode);
  if (!PKCE || (!PKCE.codeChallenge && !PKCE.codeChallengeMethod)) {
    return false;
  }
  if (PKCE.codeChallengeMethod !== 'S256') {
    return false;
  }
  const b64 = await sha256Async(codeVerifier);
  if (PKCE.codeChallenge !== convertToUrlSafeString(b64)) {
    return false;
  }
  return true;
};
