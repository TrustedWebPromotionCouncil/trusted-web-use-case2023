import { describe, it, expect, vi } from 'vitest';

import * as fetch from './fetch';

import * as tokenRequest from './tokenRequest';
import * as sleep from './sleep';
import { getCurrentTimeInSeconds } from './dateUtils';

describe('tokenRequest', () => {
  it('makeAuthTokenRequest', () => {
    const code = '1234';
    const codeVerifier = 'abcd';
    const clientId = 'hoge';
    const redirectUri = 'haip://';

    const fetchRequest = tokenRequest.makeAuthTokenRequest({
      clientId,
      code,
      codeVerifier,
      redirectUri,
    });

    expect(fetchRequest.method).toEqual('POST');
    expect(fetchRequest.dataType).toEqual('form');
    expect(fetchRequest.body).toEqual({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
    });
  });

  it('makePreAuthTokenRequest', () => {
    const preAuthorizedCode = 'abcd';
    const userPin = '1234';
    const clientId = 'hoge';

    const fetchRequest = tokenRequest.makePreAuthTokenRequest({
      clientId,
      preAuthorizedCode,
      userPin,
    });

    expect(fetchRequest.method).toEqual('POST');
    expect(fetchRequest.dataType).toEqual('form');
    expect(fetchRequest.body).toEqual({
      grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
      client_id: clientId,
      'pre-authorized_code': preAuthorizedCode,
      user_pin: userPin,
    });
  });

  it('fetchAuthTokenRequestAsync', async () => {
    const accessToken = 'abcd';
    const tokenType = 'bearer';
    const issuedAt = getCurrentTimeInSeconds();
    const expiresIn = 86400;
    const cNonce = 'efg';
    const cNonceExpiresIn = 87000;

    const res = {
      access_token: accessToken,
      token_type: tokenType,
      issued_at: issuedAt,
      expires_in: expiresIn,
      c_nonce: cNonce,
      c_nonce_expires_in: cNonceExpiresIn,
    };

    vi.spyOn(fetch, 'fetchAsync').mockResolvedValue(res);

    const ret = await tokenRequest.fetchAuthTokenRequestAsync('https://hoge', {
      dataType: 'form',
      method: 'POST',
      body: {},
    });

    expect(ret).toEqual({
      accessToken,
      tokenType,
      issuedAt,
      expiresIn,
      cNonce,
      cNonceExpiresIn,
      rawResponse: res,
    });
  });

  it('fetchAuthTokenRequestAsync when error is invalid_request', async () => {
    const res = {
      error: 'invalid_request',
    };

    vi.spyOn(fetch, 'fetchAsync').mockResolvedValue(res);

    await expect(
      tokenRequest.fetchAuthTokenRequestAsync('https://hoge', {
        dataType: 'form',
        method: 'POST',
        body: {},
      }),
    ).rejects.toThrow('Authorization Token Request Error: invalid_request');
  });

  it('fetchAuthTokenRequestAsync when error is authorization_pending', async () => {
    const accessToken = 'abcd';
    const tokenType = 'bearer';
    const issuedAt = getCurrentTimeInSeconds();
    const expiresIn = 86400;
    const cNonce = 'efg';
    const cNonceExpiresIn = 87000;

    const res = {
      access_token: accessToken,
      token_type: tokenType,
      issued_at: issuedAt,
      expires_in: expiresIn,
      c_nonce: cNonce,
      c_nonce_expires_in: cNonceExpiresIn,
    };

    let fetchAsyncCount = 0;

    const spySleep = vi.spyOn(sleep, 'sleep').mockResolvedValue(undefined);

    vi.spyOn(fetch, 'fetchAsync').mockImplementation(async () => {
      fetchAsyncCount += 1;

      if (fetchAsyncCount == 1) {
        return {
          error: 'authorization_pending',
        };
      } else {
        return res;
      }
    });

    const ret = await tokenRequest.fetchAuthTokenRequestAsync('https://hoge', {
      dataType: 'form',
      method: 'POST',
      body: {},
    });

    expect(spySleep).toHaveBeenCalledTimes(1);
    expect(spySleep).toHaveBeenCalledWith(5000);
    expect(fetchAsyncCount).toEqual(2);
    expect(ret).toEqual({
      accessToken,
      tokenType,
      issuedAt,
      expiresIn,
      cNonce,
      cNonceExpiresIn,
      rawResponse: res,
    });
  });

  it('fetchAuthTokenRequestAsync when error is slow_down', async () => {
    const accessToken = 'abcd';
    const tokenType = 'bearer';
    const issuedAt = getCurrentTimeInSeconds();
    const expiresIn = 86400;
    const cNonce = 'efg';
    const cNonceExpiresIn = 87000;

    const res = {
      access_token: accessToken,
      token_type: tokenType,
      issued_at: issuedAt,
      expires_in: expiresIn,
      c_nonce: cNonce,
      c_nonce_expires_in: cNonceExpiresIn,
    };

    let fetchAsyncCount = 0;

    const spySleep = vi.spyOn(sleep, 'sleep').mockResolvedValue(undefined);

    vi.spyOn(fetch, 'fetchAsync').mockImplementation(async () => {
      fetchAsyncCount += 1;

      if (fetchAsyncCount == 1 || fetchAsyncCount == 2) {
        return {
          error: 'slow_down',
        };
      } else if (fetchAsyncCount == 3) {
        return {
          error: 'authorization_pending',
        };
      } else {
        return res;
      }
    });

    const ret = await tokenRequest.fetchAuthTokenRequestAsync('https://hoge', {
      dataType: 'form',
      method: 'POST',
      body: {},
    });

    expect(spySleep).toHaveBeenCalledTimes(3);
    expect(spySleep).toHaveBeenCalledWith(10000);
    expect(spySleep).toHaveBeenCalledWith(15000);
    expect(spySleep).toHaveBeenCalledWith(15000);
    expect(fetchAsyncCount).toEqual(4);
    expect(ret).toEqual({
      accessToken,
      tokenType,
      issuedAt,
      expiresIn,
      cNonce,
      cNonceExpiresIn,
      rawResponse: res,
    });
  });

  it('fetchAuthTokenRequestAsync when error is retry_max_exceeded', async () => {
    vi.spyOn(sleep, 'sleep').mockResolvedValue(undefined);
    vi.spyOn(fetch, 'fetchAsync').mockResolvedValue({
      error: 'authorization_pending',
    });

    await expect(
      tokenRequest.fetchAuthTokenRequestAsync('https://hoge', {
        dataType: 'form',
        method: 'POST',
        body: {},
      }),
    ).rejects.toThrow(
      'Authorization Token Request Error: retry_max_exceeded 100',
    );
  });
});
