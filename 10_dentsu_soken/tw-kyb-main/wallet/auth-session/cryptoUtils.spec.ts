import { describe, it, expect } from 'vitest';

import { nodeCrypto } from './nodeCrypto';
import { convertBytesToString, generateRandom } from './cryptoUtils';

describe('cryptoUtils', () => {
  it('convertBytesToString', () => {
    expect(convertBytesToString(new Uint8Array([1, 2, 3, 4]))).toEqual('BCDE');
  });

  it('generateRandom should work', () => {
    const code = generateRandom(128, nodeCrypto);
    expect(code.length).toEqual(128);
  });
});
