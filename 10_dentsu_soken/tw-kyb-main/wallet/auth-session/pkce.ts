import invariant from 'invariant';
import { Crypto } from './crypto';
import * as base64Utils from './base64Utils';
import * as cryptoUtils from './cryptoUtils';

/**
 * Proof key for Code Exchange by OAuth Public Clients (RFC 7636), Section 4.1
 * [Section 4.1](https://tools.ietf.org/html/rfc7636#section-4.1)
 */
export const deriveChallengeAsync = async (
  code: string,
  crypto: Crypto,
): Promise<string> => {
  // 43 is the minimum, and 128 is the maximum.
  invariant(
    code.length > 42 && code.length < 129,
    'Invalid code length for PKCE.',
  );

  const b64 = await crypto.sha256Async(code);
  return base64Utils.convertToUrlSafeString(b64);
};

export const buildCodeAsync = async (
  size: number,
  crypto: Crypto,
): Promise<{ codeVerifier: string; codeChallenge: string }> => {
  const codeVerifier = cryptoUtils.generateRandom(size, crypto);
  const codeChallenge = await deriveChallengeAsync(codeVerifier, crypto);

  return { codeVerifier, codeChallenge };
};
