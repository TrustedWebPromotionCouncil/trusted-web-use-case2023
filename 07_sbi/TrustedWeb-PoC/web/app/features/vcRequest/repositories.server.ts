import { sql } from 'kysely';
import { dbRead } from '~/db/db.server';
import { type SignedVC } from '~/features/api/api';
import { STATUS } from './constants';

export const getBusinessVcRequests = () =>
  dbRead
    .selectFrom('business_vc_request')
    .select(['request_id', (qb) => sql<SignedVC>`${qb.ref('signed_vc')}`.as('signed_vc'), 'status'])
    .where('signed_vc', 'is not', null)
    .execute();

export const getBusinessVcRequestByRequestId = (requestId: string) =>
  dbRead
    .selectFrom('business_vc_request')
    .select((qb) => sql<SignedVC>`${qb.ref('signed_vc')}`.as('signed_vc'))
    .where('request_id', '=', requestId)
    .where('signed_vc', 'is not', null)
    .executeTakeFirst();

export const revokeBusinessVcRequests = (requestId: string) =>
  dbRead
    .updateTable('business_vc_request')
    .set({ status: STATUS.REVOKED })
    .where('request_id', '=', requestId)
    .execute();
