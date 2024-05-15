import { describe, it, expect } from 'vitest';

import { uint8ArrayToHex } from './hexUtils';

describe('hexUtils', () => {
  it('uint8ArrayToHex', () => {
    expect(uint8ArrayToHex(Uint8Array.from([65, 66, 67, 68]))).toEqual(
      '41424344'
    );
  });
});
