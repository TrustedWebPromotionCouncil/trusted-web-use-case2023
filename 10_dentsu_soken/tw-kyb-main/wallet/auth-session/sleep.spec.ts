import { describe, it, expect, vi } from 'vitest';

import { sleep } from './sleep';

describe('sleep', () => {
  it('sleep', async () => {
    const now = Date.now();

    await sleep(200);

    expect(Date.now()).toBeGreaterThanOrEqual(now + 100);
  });
});
