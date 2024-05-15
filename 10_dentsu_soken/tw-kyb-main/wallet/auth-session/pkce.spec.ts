import { describe, it, expect } from 'vitest';

import { deriveChallengeAsync, buildCodeAsync } from './pkce';
import { generateRandom } from './cryptoUtils';
import { nodeCrypto } from './nodeCrypto';

describe('pkce', () => {
  it('deriveChallengeAsync should work', async () => {
    const code = generateRandom(128, nodeCrypto);
    const challenge = await deriveChallengeAsync(code, nodeCrypto);
    expect(challenge).toBeDefined();
  });

  it('buildCodeAsync should work', async () => {
    const ret = await buildCodeAsync(128, nodeCrypto);

    expect(ret.codeVerifier).toBeDefined();
    expect(ret.codeChallenge).toBeDefined();
  });
});
