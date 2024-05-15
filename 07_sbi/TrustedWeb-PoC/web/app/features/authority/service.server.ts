import { type ActionArgs, json, redirect } from '@remix-run/node';
import { isAxiosError } from 'axios';
import { $path } from 'remix-routes';
import { makeAxios } from '~/axiosConfig.server';
import { cordaApiClient } from '~/features/corda/api';
import { getCordaLoader } from '~/features/corda/services.server';
import { type AuthrityUser } from '~/features/user/types';
import { defaultPeriod } from '~/features/vcRequest/models';
import {
  getBusinessVcRequestByRequestId,
  getBusinessVcRequests,
  revokeBusinessVcRequests,
} from '~/features/vcRequest/repositories.server';
import { notFound } from '~/requests.server';
import { exceptionableResponseWrapperWithUser } from '~/utils.server';
import { revokeVcParamsValidator } from './validators';

export const vcIssuedsLoader = getCordaLoader('authority', () => ({ vcIssueds: getBusinessVcRequests() }));

export const vcReceivedsLoader = getCordaLoader('authority', (user: AuthrityUser) => {
  return ({ vcReceiveds: cordaApiClient(user).getCordavcJsonList() });
});

export const createVcRequest = exceptionableResponseWrapperWithUser(
  async (user: AuthrityUser) => {
    const vcID = crypto.randomUUID();
    await cordaApiClient(user).postCordavcJson({
      vcID,
      authOrgName: 'VCAuthOrg',
      validityPeriod: defaultPeriod(),
    });
    return redirect($path('/authority/vcreceiveds'));
  },
  {
    condition: isAxiosError,
    data: { error: 'corda error.' },
    message: 'Cordaとの通信でエラーが発生しました。',
  },
);

export const revokeVc = async ({ params }: ActionArgs, user: AuthrityUser) => {
  const paramsResult = await revokeVcParamsValidator.validate(params);
  if (paramsResult.error) {
    console.log(paramsResult.error.fieldErrors);
    throw notFound();
  }
  const vc = await getBusinessVcRequestByRequestId(paramsResult.data.uuid);
  if (vc == null) throw notFound();
  const axios = makeAxios();
  try {
    await axios.delete(`${user.corda_upstream_url}/corda/revocation/vc/${vc.signed_vc.credentialSubject.uuid}`);
  } catch {
    return json({ error: 'corda error.' });
  }
  await revokeBusinessVcRequests(paramsResult.data.uuid);
  return json({ revokedAt: new Date() });
};
