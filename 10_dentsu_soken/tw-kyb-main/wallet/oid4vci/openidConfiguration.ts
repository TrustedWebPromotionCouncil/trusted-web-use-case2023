import { OpenidConfiguration } from './types';

export const fetchOpenidConfiguration = async (
  issuer: string,
): Promise<OpenidConfiguration> => {
  const res = await fetch(`${issuer}/.well-known/openid-configuration`);
  const json = await res.json();
  return json as OpenidConfiguration;
};
