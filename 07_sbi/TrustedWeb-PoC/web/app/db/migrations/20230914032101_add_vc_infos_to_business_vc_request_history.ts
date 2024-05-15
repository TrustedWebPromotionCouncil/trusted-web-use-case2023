import { type Kysely } from 'kysely';

// alterTable 後に method chain しても postgres の構文を正しく書かないらしいのでひとつづつ地道に書く
export const up = async ({ schema }: Kysely<unknown>) => {
  await schema.alterTable('business_vc_request_history').renameColumn('business', 'business_id').execute();
  await schema
    .alterTable('business_vc_request_history')
    .addColumn('vc_id', 'varchar(256)', (ac) => ac.notNull().unique())
    .execute();
  await schema
    .alterTable('business_vc_request_history')
    .addColumn('issuer_id', 'int4', (ac) => ac.references('authority.id').onDelete('cascade').notNull())
    .execute();
  await schema
    .alterTable('business_vc_request_history')
    .addColumn('request_id', 'varchar(128)', (ac) => ac.unique())
    .execute();
  await schema
    .alterTable('business_vc_request_history')
    .addColumn('vc', 'json')
    .execute();
};

export const down = async ({ schema }: Kysely<unknown>) => {
  await schema.alterTable('business_vc_request_history').dropColumn('vc').execute();
  await schema.alterTable('business_vc_request_history').dropColumn('request_id').execute();
  await schema.alterTable('business_vc_request_history').dropColumn('issuer_id').execute();
  await schema.alterTable('business_vc_request_history').dropColumn('vc_id').execute();
  await schema.alterTable('business_vc_request_history').renameColumn('business_id', 'business').execute();
};
