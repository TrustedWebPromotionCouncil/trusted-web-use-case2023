import { type Kysely } from 'kysely';

export const up = async ({ schema }: Kysely<unknown>) => {
  await schema.alterTable('business_vc_request')
    .renameColumn('vc', 'received_vc')
    .execute();
  await schema.alterTable('business_vc_request')
    .addColumn('signed_vc', 'json')
    .execute();
};

export const down = async ({ schema }: Kysely<unknown>) => {
  await schema.alterTable('business_vc_request')
    .dropColumn('signed_vc')
    .execute();
  await schema.alterTable('business_vc_request')
    .renameColumn('received_vc', 'vc')
    .execute();
};
