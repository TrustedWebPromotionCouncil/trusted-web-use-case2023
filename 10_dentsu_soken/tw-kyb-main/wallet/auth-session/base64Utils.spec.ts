import { describe, it, expect } from 'vitest';

import * as base64Utils from './base64Utils';

describe('base64Utils', () => {
  it('convertToUrlSafeString', () => {
    expect(base64Utils.convertToUrlSafeString('a+b+c/d/e===')).toEqual(
      'a-b-c_d_e',
    );
  });
});
