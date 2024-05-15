import { cordaApiClient } from '~/features/corda/api';
import { getCordaLoader } from '~/features/corda/services.server';

export const vcIssuedsForAuthCompanyLoader = getCordaLoader(
  'public',
  (user) => ({ vcIssueds: cordaApiClient(user).getCordavcJsonListForAuthCompany() }),
);

export const vcIssuedsForAuthConsortiumLoader = getCordaLoader(
  'public',
  (user) => ({ vcIssueds: cordaApiClient(user).getCordavcJsonListForAuthConsortium() }),
);
