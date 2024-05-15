import { describe, it, expect } from 'vitest';

import { createUuidv4, getOrCreateUuidv4 } from './uuidv4Utils';

describe('uuidv4Utils', () => {
  it('createUuidv4 should return uuidv4', () => {
    expect(createUuidv4()).toBeDefined();
  });

  it('getOrCreateUuidv4 should return the parameter itself when the parameter is not empty', () => {
    expect(getOrCreateUuidv4('aaa')).toEqual('aaa');
  });

  it('getOrCreateUuidv4 should return uuidv4 when the parameter is empty', () => {
    expect(getOrCreateUuidv4('').length).greaterThan(0);
    expect(getOrCreateUuidv4(undefined).length).greaterThan(0);
    expect(getOrCreateUuidv4(null).length).greaterThan(0);
  });
});
