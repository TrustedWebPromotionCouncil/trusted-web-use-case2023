import { describe, it, expect } from 'vitest';

import * as queryParams from './queryParams';

describe('queryParams', () => {
  it('buildQueryString', () => {
    expect(
      queryParams.buildQueryString({ aaa: '1', bbb: 'a', ccc: 'true' }),
    ).toEqual('aaa=1&bbb=a&ccc=true');

    const obj = { bbb: '1' };
    const objStr = JSON.stringify(obj);
    const encodedObjStr = encodeURIComponent(objStr);

    expect(queryParams.buildQueryString({ aaa: objStr })).toEqual(
      `aaa=${encodedObjStr}`,
    );
  });

  it('parse', () => {
    expect(queryParams.parse('aaa=1&bbb=2&&ccc=true')).toEqual({
      aaa: '1',
      bbb: '2',
      ccc: 'true',
    });

    const obj = { bbb: '1' };
    const objStr = JSON.stringify(obj);
    const encodedObjStr = encodeURIComponent(objStr);

    expect(queryParams.parse(`aaa=${encodedObjStr}`)).toEqual({ aaa: objStr });
    expect(queryParams.parse(null)).toEqual({});
  });

  it('getQueryParams', () => {
    expect(queryParams.getQueryParams('haip://?aaa=1&bbb=2')).toEqual({
      aaa: '1',
      bbb: '2',
    });
    expect(queryParams.getQueryParams('haip://?aaa=1&bbb=2#ccc=3')).toEqual({
      aaa: '1',
      bbb: '2',
      ccc: '3',
    });
    expect(queryParams.getQueryParams('haip://#ccc=3')).toEqual({
      ccc: '3',
    });
    expect(queryParams.getQueryParams('haip://')).toEqual({});

    const obj = { bbb: '1' };
    const objStr = JSON.stringify(obj);
    const encodedObjStr = encodeURIComponent(objStr);

    expect(queryParams.getQueryParams(`haip://?aaa=${encodedObjStr}`)).toEqual({
      aaa: objStr,
    });
  });
});
