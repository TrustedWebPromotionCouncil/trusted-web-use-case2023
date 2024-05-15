import invariant from 'invariant';
import qs from 'qs';

export type Params = Record<string, string>;

export const buildQueryString = (params: Params): string => {
  return qs.stringify(params);
};

export const parse = (str: string | null): Params => {
  return (
    str
      ? qs.parse(str, {
          parseArrays: false,
        })
      : {}
  ) as Params;
};

export const getQueryParams = (url: string): Params => {
  const parts = url.split('#');
  const hash = parts[1];
  const queryString = parts[0].split('?')[1];

  const parsedQueryString = parse(queryString);

  const errorCode = (parsedQueryString.errorCode ?? null) as string | null;
  invariant(errorCode === null, `The error occurred`);
  delete parsedQueryString.errorCode;

  const parsedHash = parse(hash);

  return {
    ...parsedQueryString,
    ...parsedHash,
  };
};
