import { defer, json, type LoaderArgs, redirect } from '@remix-run/node';
import { $path } from 'remix-routes';
import { type ValidatorData } from 'remix-validated-form';
import { apiClient } from '~/features/api/api';
import { DEFAULT_AUTHORITY_NAME } from '~/features/authority/constants';
import { vcRequestValidator } from '~/features/business/validators';
import { type BusinessUser } from '~/features/user/types';
import { vcAxios } from '~/features/vc/api';
import { checkedFormData, getResponseOrThrowWithCatchAction } from '~/requests.server';
import { loader as businessLoader } from '~/routes/business';
import { BUSINESS_VC_REQUEST_STATUS } from './models';
import {
  getApprovedBusinessVcRequestHistoryByBussinessId,
  // getBusinessVcRequestSuccessHistories,
  getRejectedBusinessVcRequestHistoryByBussinessId,
  insertBusinessVcRequestHistory,
  updateBusinessVcRequestHistoryRequestSucess,
  updateBusinessVcRequestHistoryStatus,
  updateVcBusinessVcRequestHistory,
} from './repositories.server';

const createVcImpl = async (params: ValidatorData<typeof vcRequestValidator>, user: BusinessUser) => {
  const { vcID, now } = await insertBusinessVcRequestHistory(user, DEFAULT_AUTHORITY_NAME, params);
  const { authId, challenge } = await getResponseOrThrowWithCatchAction(
    () => apiClient.get('/:organizationName/challenge', { params: { organizationName: 'authority-1' } }),
    async () => {
      await updateBusinessVcRequestHistoryStatus(vcID, BUSINESS_VC_REQUEST_STATUS.GET_CHALLENGE_FAIL);
    },
  );
  const { keyName } = (await getResponseOrThrowWithCatchAction(
    () => vcAxios.get('/api/keyName4AuthOrg'),
    async () => {
      await updateBusinessVcRequestHistoryStatus(vcID, BUSINESS_VC_REQUEST_STATUS.GET_KEY_NAME_FAIL);
    },
  )).data;
  const { publicKeyMultibase } = (await getResponseOrThrowWithCatchAction(
    () => vcAxios.get(`/api/publicKeyMultibase/${keyName}`),
    async () => {
      await updateBusinessVcRequestHistoryStatus(vcID, BUSINESS_VC_REQUEST_STATUS.GET_PUBLIC_KEY_FAIL);
    },
  )).data;
  const issuerID = `did:detc:${user.business_name}`;

  const {
    country,
    addressIncludedInVc,
    address,
    contactInfoIncludedInVc,
    contactName,
    contactDepartment,
    contactJobTitle,
    contactNumber,
    legalEntityIdentifier,
    legalEntityName,
    location,
    authenticationLevel,
  } = params;

  const vc = (await getResponseOrThrowWithCatchAction(
    () =>
      vcAxios.post('/api/vc', {
        keyName,
        vcID,
        issuerID,
        issuerName: user.business_name,
        validFrom: now.toISOString(),
        credentialSubject: {
          didDocument: {
            '@context': 'https://w3id.org/did/v1',
            id: issuerID,
            verificationMethod: [{
              type: 'Ed25519VerificationKey2018',
              controller: issuerID,
              publicKeyMultibase,
            }],
          },
          businessUnitInfo: {
            businessUnitName: user.business_name,
            country,
            ...(addressIncludedInVc ? { address, country } : {}),
            ...(contactInfoIncludedInVc ?
              {
                contactInfo: {
                  name: contactName,
                  department: contactDepartment,
                  jobTitle: contactJobTitle,
                  contactNumber,
                },
              } :
              {}),
          },
          legalEntityInfo: {
            legalEntityIdentifier,
            legalEntityName,
            location,
          },
          authenticationLevel: `${authenticationLevel}`,
          challenge,
        },
      }),
    async () => {
      await updateBusinessVcRequestHistoryStatus(vcID, BUSINESS_VC_REQUEST_STATUS.CREATE_VC_FAIL);
    },
  )).data;

  const { requestId, vc: requestedVc } = await getResponseOrThrowWithCatchAction(
    () =>
      apiClient.post('/:authorityName/vc-requests', vc, {
        headers: { 'TTW-Auth-Id': authId },
        params: { authorityName: 'authority-1' },
      }),
    async () => {
      await updateBusinessVcRequestHistoryStatus(vcID, BUSINESS_VC_REQUEST_STATUS.REQUEST_VC_FAIL);
    },
  );

  await updateBusinessVcRequestHistoryRequestSucess(vcID, requestId);
  await updateVcBusinessVcRequestHistory(vcID, requestedVc!);
};

export const createVc = checkedFormData(
  vcRequestValidator,
  async (params, user: BusinessUser) => {
    await createVcImpl(params, user);

    return redirect($path('/business/vcrequests'));
  },
);

export const renewVc = checkedFormData(
  vcRequestValidator,
  async (params, user: BusinessUser) => {
    await createVcImpl(params, user);

    return json({ renewedAt: new Date() });
  },
);

/*
export const getVc = async (request_id: string, vc_id: string, business_name: string) => {
  const { authId, challenge } = await apiClient.get('/challenge');
  const { keyName } = (await axios.get(`${VC_API_UPSTREAM_URL_BASE}/api/keyName4AuthOrg`)).data;
  const { publicKeyMultibase } =
    (await axios.get(`${VC_API_UPSTREAM_URL_BASE}/api/publicKeyMultibase/${keyName}`)).data;
  const issuerID = `did:detc:${DEFAULT_AUTHORITY_NAME}`;
  const documentID = `did:detc:${business_name}`;
  const vc = (await axios.post(`${VC_API_UPSTREAM_URL_BASE}/api/vc`, {
    keyName,
    vcID: vc_id,
    issuerID,
    issuerName: DEFAULT_AUTHORITY_NAME,
    validFrom: new Date().toISOString(),
    credentialSubject: {
      didDocument: {
        '@context': 'https://w3id.org/did/v1',
        id: documentID,
        verificationMethod: [{
          controller: documentID,
          publicKeyMultibase,
          type: 'Ed25519VerificationKey2018',
        }],
      },
      challenge,
    },
  })).data;
  return apiClient.post('/:organizationName/vc-requests/:requestId', vc, {
    headers: { 'TTW-Auth-Id': authId },
    params: { organizationName: 'authority-1', requestId: request_id! },
  });
};*/

export const approvedBusinessVcRequestHistory = async (args: LoaderArgs) => {
  const { business_id /*, business_name*/ } = await (await businessLoader(args)).json();
  /*const successRequestIds = await getBusinessVcRequestSuccessHistories(business_id);
  await Promise.all(successRequestIds.map(async ({ request_id, vc_id }) => {
    const vc = await getVc(request_id!, vc_id, business_name);
    await updateVcBusinessVcRequestHistory(vc_id, vc);
  }));*/
  return defer({ vcRequests: getApprovedBusinessVcRequestHistoryByBussinessId(business_id) });
};

export const rejectedBusinessVcRequestHistory = async (args: LoaderArgs) => {
  const { business_id } = await (await businessLoader(args)).json();
  return defer({ vcRequests: getRejectedBusinessVcRequestHistoryByBussinessId(business_id) });
};
