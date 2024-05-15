import { describe, it, expect } from 'vitest';

import { OkRes, ErrRes, isOk } from './variantUtils';

describe('variantUtils', () => {
  it('isOk', () => {
    type Res = OkRes<string> | ErrRes<string>;
    const okRes: Res = { Ok: 'Ok' };
    const errRes: Res = { Err: 'Err' };

    expect(isOk(okRes) ? okRes.Ok : undefined).toEqual('Ok');
    expect(isOk(errRes) ? undefined : errRes.Err).toEqual('Err');
  });
});
