import Tags from 'language-tags';
import { Errors } from '../types';

const LANGUAGE_TAG_SEPARATOR = '#';

export const convertFieldName = (
  fieldName: string,
  fieldNameMappings: Map<string, string>,
): string | undefined => {
  const parts = fieldName.split(LANGUAGE_TAG_SEPARATOR);

  if (
    parts.length == 2 &&
    Tags.check(parts[1]) &&
    fieldNameMappings.has(parts[0])
  ) {
    return `${fieldNameMappings.get(parts[0])}#${parts[1]}`;
  }

  return undefined;
};

export const getConvertedLanguageTags = (
  source: unknown,
  fieldNameMapping: Map<string, string>,
): Map<string, unknown> => {
  if (!source) {
    throw new Error(Errors.NULLISH_SOURCE);
  }

  const convertedLanguageTags = new Map<string, unknown>();

  Object.entries(source).forEach(([key, value]) => {
    const convertedFieldName = convertFieldName(key, fieldNameMapping);

    if (convertedFieldName) {
      convertedLanguageTags.set(convertedFieldName, value);
    }
  });

  return convertedLanguageTags;
};
