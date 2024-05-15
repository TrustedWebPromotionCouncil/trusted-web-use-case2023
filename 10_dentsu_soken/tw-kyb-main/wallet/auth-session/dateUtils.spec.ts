import { describe, it, expect, vi } from 'vitest';

import {
  getCurrentTimeInSeconds,
  validIssuedAt,
  validExpiresIn,
} from './dateUtils';

describe('dateUtils', () => {
  it('getCurrentTimeInSeconds', async () => {
    const now = 123456789;
    vi.spyOn(Date, 'now').mockReturnValue(now);

    expect(getCurrentTimeInSeconds()).toEqual(123456);
  });

  it('validIssuedAt', async () => {
    const now = 123456789;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    const issuedAt = 123456;

    expect(validIssuedAt(issuedAt)).toEqual(true);
    expect(validIssuedAt(issuedAt + 60 * 5)).toEqual(true);
    expect(validIssuedAt(issuedAt + 60 * 5 + 1)).toEqual(false);
  });

  it('validExpiresIn', async () => {
    const now = 123456789;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    const issuedAt = 123456;

    expect(validExpiresIn(issuedAt)).toEqual(true);
    expect(validExpiresIn(issuedAt, 60 * 5)).toEqual(true);
    expect(validExpiresIn(issuedAt, 60 * 5 - 1)).toEqual(false);
  });
});
