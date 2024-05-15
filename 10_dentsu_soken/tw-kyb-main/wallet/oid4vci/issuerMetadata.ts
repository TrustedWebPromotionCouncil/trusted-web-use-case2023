import { IssuerMetadata } from './types';

export const fetchIssuerMetadata = async (
  issuer: string,
): Promise<IssuerMetadata> => {
  const res = await fetch(`${issuer}/.well-known/openid-credential-issuer`);
  const json = await res.json();
  return json as IssuerMetadata;
};

export const getCredentialConfigurationIds = (
  meta: IssuerMetadata,
): string[] => {
  return Object.keys(meta.credential_configurations_supported);
};
