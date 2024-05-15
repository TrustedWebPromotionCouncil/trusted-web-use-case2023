import { describe, it, expect } from 'vitest';

import { checkAuthResponse, parseAuthResponseUrl } from './authResponse';

describe('authResponse', () => {
  it('checkAuthResponse', () => {
    expect(
      checkAuthResponse({ type: 'success', url: 'haip://code=1234' }),
    ).toEqual('haip://code=1234');
    expect(checkAuthResponse({ type: 'cancel' })).toBeUndefined();
    expect(() => checkAuthResponse({ type: 'locked' })).toThrowError(
      'Unexpected response type: locked',
    );
  });

  it('parseAuthResponseUrl', () => {
    expect(
      parseAuthResponseUrl(
        'haip://?code=1234&state=abc&issuer_state=a12&name=hoge',
      ),
    ).toEqual({
      code: '1234',
      state: 'abc',
      issuerState: 'a12',
      params: { code: '1234', state: 'abc', issuer_state: 'a12', name: 'hoge' },
    });
    expect(() =>
      parseAuthResponseUrl(
        'haip://?error=invalid_request&error_description=Unsupported response_type value',
      ),
    ).toThrowError('invalid_request: Unsupported response_type value');
  });
});
