import { describe, it, expect } from 'vitest';

import { convertFieldName } from './languageTagsUtils';

describe('convertFieldName', () => {
  it('should convert to snake_case#lang when its name is camelCase#lang', () => {
    const mappings = new Map<string, string>();
    mappings.set('clientName', 'client_name');

    expect(convertFieldName('clientName#ja', mappings)).toEqual(
      'client_name#ja',
    );
    expect(convertFieldName('clientName#ja-JP', mappings)).toEqual(
      'client_name#ja-JP',
    );
  });

  it('should return undefined when its name is not target', () => {
    const mappings = new Map<string, string>();
    mappings.set('clientName', 'client_name');

    expect(convertFieldName('clientName#xxx', mappings)).toBeUndefined();
    expect(convertFieldName('clientName@ja', mappings)).toBeUndefined();
    expect(convertFieldName('xxx#ja', mappings)).toBeUndefined();
  });
});
