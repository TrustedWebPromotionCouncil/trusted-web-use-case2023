import { describe, it, expect } from 'vitest';

import { nodeCrypto } from './nodeCrypto';
import { convertBytesToString } from './cryptoUtils';

describe('nodeCrypto', () => {
  it('getRandomBytes()', () => {
    const bytes = nodeCrypto.getRandomBytes(128);
    expect(bytes.length).toEqual(128);
  });

  it('sha256Async()', async () => {
    const bytes = nodeCrypto.getRandomBytes(128);
    const code = convertBytesToString(bytes);

    const digest = await nodeCrypto.sha256Async(code);
    console.log(digest);
    expect(digest).toBeDefined();
  });
});
