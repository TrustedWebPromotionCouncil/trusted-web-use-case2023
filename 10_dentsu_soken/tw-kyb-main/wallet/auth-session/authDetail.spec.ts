import { describe, it, expect } from 'vitest';

import { makeAuthDetail4VcSdJwt } from './authDetail';

describe('authDetail', () => {
  it('makeAuthDetail4VcSdJwt', () => {
    const authDetail = makeAuthDetail4VcSdJwt();
    expect(authDetail).toBeDefined();
  });
});
