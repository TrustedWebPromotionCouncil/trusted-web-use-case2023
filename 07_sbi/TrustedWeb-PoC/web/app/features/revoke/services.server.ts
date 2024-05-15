import { redirect } from '@remix-run/node';
import { isAxiosError } from 'axios';
import { $path } from 'remix-routes';
import { DEFAULT_AUTHORITY_NAME } from '~/features/authority/constants';
import { cordaApiClient } from '~/features/corda/api';
import { getCordaLoader } from '~/features/corda/services.server';
import { type RevokeUser } from '~/features/user/types';
import { defaultPeriod } from '~/features/vcRequest/models';
import { exceptionableResponseWrapperWithUser } from '~/utils.server';

export const vcIssueds = getCordaLoader(
  'revoke',
  (user) => ({ vcIssueds: cordaApiClient(user).getCordavcJsonList() }),
);

export const createVcRequest = exceptionableResponseWrapperWithUser(
  async (user: RevokeUser) => {
    const vcID = crypto.randomUUID();
    await cordaApiClient(user).postCordavcJson({
      vcID,
      authOrgName: DEFAULT_AUTHORITY_NAME,
      validityPeriod: defaultPeriod(),
    });
    return redirect($path('/revoke/vcissueds'));
  },
  {
    condition: isAxiosError,
    data: { error: 'corda error.' },
    message: 'Cordaとの通信でエラーが発生しました。',
  },
);

export const idRevokeds = getCordaLoader('revoke', (user) => {
  const apiClient = cordaApiClient(user);
  return {
    idRevokeds: apiClient.getCordarevocationvcRevokedList(),
    idValids: apiClient.getCordarevocationvcValidList(),
  };
});
