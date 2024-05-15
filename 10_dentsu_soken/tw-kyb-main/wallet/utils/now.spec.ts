import { describe, it, expect, vi } from 'vitest';

import { getCurrentTimeInSeconds } from './now';

describe('now', () => {
  it('getCurrentTimeInSeconds', async () => {
    const now = 123456789;
    vi.spyOn(Date, 'now').mockReturnValue(now);

    expect(getCurrentTimeInSeconds()).toEqual(123456);
  });
});
