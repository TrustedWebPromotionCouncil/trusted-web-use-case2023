import { sql } from 'kysely';
import { type ValidatorData } from 'remix-validated-form';
import { dbConnection, dbRead } from '~/db/db.server';
import { type SignedVC } from '~/features/api/api';
import { getAuthorityIdByName } from '~/features/authority/repositories.server';
import { type BusinessUser } from '~/features/user/types';
import { makeVcId } from '~/features/vcRequest/models';
import { BUSINESS_VC_REQUEST_STATUS } from './models';
import { type vcRequestValidator } from './validators';

const getNextVcSequenceByBusinessUser = async (user: BusinessUser) => {
  const history = await dbRead
    .selectFrom('business_vc_request_history')
    .select('sequence')
    .where('business_id', '=', user.business_id)
    .orderBy('sequence', 'desc')
    .limit(1)
    .executeTakeFirst();
  return (history?.sequence ?? 0) + 1;
};

export const insertBusinessVcRequestHistory = async (
  user: BusinessUser,
  issueName: string,
  {
    country,
    address,
    addressIncludedInVc,
    contactName,
    contactDepartment,
    contactJobTitle,
    contactNumber,
    contactInfoIncludedInVc,
    legalEntityIdentifier,
    legalEntityName,
    location,
    authenticationLevel,
  }: ValidatorData<
    typeof vcRequestValidator
  >,
) => {
  const sequence = await getNextVcSequenceByBusinessUser(user);
  const { id: issuer_id } = await getAuthorityIdByName(issueName);
  const now = new Date();

  const { vc_id } = await dbConnection()
    .insertInto('business_vc_request_history')
    .values({
      business_id: user.business_id,
      sequence,
      country,
      address,
      address_included_in_vc: addressIncludedInVc,
      contact_name: contactName,
      contact_department: contactDepartment,
      contact_job_title: contactJobTitle,
      contact_number: contactNumber,
      contact_info_included_in_vc: contactInfoIncludedInVc,
      legal_entity_identifier: legalEntityIdentifier,
      legal_entity_name: legalEntityName,
      legal_entity_location: location,
      applied_authentication_level: authenticationLevel,
      status: BUSINESS_VC_REQUEST_STATUS.INSERT,
      created_at: now,
      updated_at: now,
      vc_id: makeVcId(sequence),
      issuer_id,
    })
    .returning(['vc_id'])
    .executeTakeFirstOrThrow();

  return { vcID: vc_id, now };
};

export const updateBusinessVcRequestHistoryStatus = (
  vcId: string,
  status: keyof typeof BUSINESS_VC_REQUEST_STATUS,
) => dbConnection().updateTable('business_vc_request_history').set({ status }).where('vc_id', '=', vcId).execute();

export const updateBusinessVcRequestHistoryRequestSucess = (
  vcId: string,
  requestId: string,
) =>
  dbConnection().updateTable('business_vc_request_history').set({
    status: BUSINESS_VC_REQUEST_STATUS.REQUEST_VC_SUCCESS,
    request_id: requestId,
  }).where('vc_id', '=', vcId).execute();

export const updateVcBusinessVcRequestHistory = (vcId: string, vc: SignedVC) =>
  dbConnection().updateTable('business_vc_request_history').set({
    status: BUSINESS_VC_REQUEST_STATUS.VC_APPROVED,
    vc: JSON.stringify(vc),
  }).where('vc_id', '=', vcId).execute();

export const getBusinessVcRequestSuccessHistories = (business_id: number) =>
  dbRead
    .selectFrom('business_vc_request_history')
    .select(['request_id', 'vc_id'])
    .where('business_id', '=', business_id)
    .where('status', '=', BUSINESS_VC_REQUEST_STATUS.REQUEST_VC_SUCCESS)
    .execute();

export const getApprovedBusinessVcRequestHistoryByBussinessId = (business_id: number) =>
  dbRead
    .selectFrom('business_vc_request_history')
    .innerJoin('authority', 'business_vc_request_history.issuer_id', 'authority.id')
    .select([
      'business_vc_request_history.vc_id',
      'business_vc_request_history.applied_authentication_level',
      (qb) => qb.ref('authority.name').as('authority_name'),
      'business_vc_request_history.address_included_in_vc',
      'business_vc_request_history.contact_info_included_in_vc',
      (qb) => sql<SignedVC>`${qb.ref('business_vc_request_history.vc')}`.as('vc'),
      'business_vc_request_history.address',
      'business_vc_request_history.contact_name',
      'business_vc_request_history.contact_department',
      'business_vc_request_history.contact_job_title',
      'business_vc_request_history.contact_number',
    ])
    .where('business_id', '=', business_id)
    .where('status', '=', BUSINESS_VC_REQUEST_STATUS.VC_APPROVED)
    .execute();

export const getRejectedBusinessVcRequestHistoryByBussinessId = (business_id: number) =>
  dbRead
    .selectFrom('business_vc_request_history')
    .innerJoin('authority', 'business_vc_request_history.issuer_id', 'authority.id')
    .select([
      'business_vc_request_history.vc_id',
      'business_vc_request_history.applied_authentication_level',
      (qb) => qb.ref('authority.name').as('authority_name'),
    ])
    .where('business_id', '=', business_id)
    .where('status', '=', BUSINESS_VC_REQUEST_STATUS.VC_REJECTED)
    .execute();
