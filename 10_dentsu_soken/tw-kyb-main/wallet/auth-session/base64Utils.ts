export const convertToUrlSafeString = (b64: string): string => {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};
