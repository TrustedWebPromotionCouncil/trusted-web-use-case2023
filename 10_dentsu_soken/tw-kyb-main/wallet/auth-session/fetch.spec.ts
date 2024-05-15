import { describe, it, expect } from 'vitest';

import { fetchAsync } from './fetch';

const baseURL = 'https://tw-isid-test.web.app';

describe('fetch', () => {
  it('fetchAsync for GET', async () => {
    const url = `${baseURL}/hello`;
    const ret: string = await fetchAsync(url, {
      method: 'GET',
      dataType: 'query',
      body: { name: 'aaaa' },
    });
    expect(ret).toEqual('Hello aaaa');
  });

  it('fetchAsync for POST/form', async () => {
    const url = `${baseURL}/add`;
    const ret: string = await fetchAsync(url, {
      method: 'POST',
      dataType: 'form',
      body: { arg1: '1', arg2: '2' },
    });
    //console.log('ret', ret);
    expect(ret).toEqual('result=3');
  });

  it('fetchAsync for POST/json', async () => {
    const url = `${baseURL}/addJson`;
    const ret: {
      message?: string;
      result?: string;
    } = await fetchAsync(url, {
      method: 'POST',
      dataType: 'json',
      body: JSON.stringify({ arg1: '1', arg2: '2' }),
    });
    //console.log('ret', ret);
    expect(ret).toEqual({ result: 3 });
  });
});
