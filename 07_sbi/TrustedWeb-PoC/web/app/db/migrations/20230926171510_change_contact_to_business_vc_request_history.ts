import { type Kysely } from 'kysely';

export const up = async ({ schema }: Kysely<unknown>) => {
  await schema.alterTable('business_vc_request_history').renameColumn('contact_person', 'contact_name').execute();
  await schema
    .alterTable('business_vc_request_history')
    .addColumn('contact_department', 'varchar(30)', (ac) => ac.notNull())
    .execute();
  await schema
    .alterTable('business_vc_request_history')
    .addColumn('contact_job_title', 'varchar(30)', (ac) => ac.notNull())
    .execute();
};

export const down = async ({ schema }: Kysely<unknown>) => {
  await schema.alterTable('business_vc_request_history').dropColumn('contact_job_title').execute();
  await schema.alterTable('business_vc_request_history').dropColumn('contact_department').execute();
  await schema.alterTable('business_vc_request_history').renameColumn('contact_name', 'contact_person').execute();
};
