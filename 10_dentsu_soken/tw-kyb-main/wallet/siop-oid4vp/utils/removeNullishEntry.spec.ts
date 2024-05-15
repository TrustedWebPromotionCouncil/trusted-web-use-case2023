import { describe, it, expect } from 'vitest';

import removeNullishEntry from './removeNullishEntry';

describe('removeNullishEntry', () => {
  it('should return param itself when param is nullish', () => {
    expect(removeNullishEntry(null)).toBeNull();
    expect(removeNullishEntry(undefined)).toBeUndefined();
  });

  it('should remove nullish entries', () => {
    const obj = {
      aaa: 1,
      bbb: null,
      ccc: 'hoge',
    };
    expect(removeNullishEntry(obj)).toEqual({
      aaa: 1,
      ccc: 'hoge',
    });

    const obj2 = {
      aaa: 1,
      bbb: undefined,
      ccc: 'hoge',
    };
    expect(removeNullishEntry(obj2)).toEqual({
      aaa: 1,
      ccc: 'hoge',
    });

    const obj3 = {
      aaa: 1,
      ccc: 'hoge',
    };
    expect(removeNullishEntry(obj3)).toEqual({
      aaa: 1,
      ccc: 'hoge',
    });
  });

  it('should remove nullish entries recursively', () => {
    const obj = {
      aaa: 1,
      bbb: null,
      ccc: {
        ddd: 2,
        eee: null,
      },
    };
    expect(removeNullishEntry(obj)).toEqual({
      aaa: 1,
      ccc: {
        ddd: 2,
      },
    });
  });
});
