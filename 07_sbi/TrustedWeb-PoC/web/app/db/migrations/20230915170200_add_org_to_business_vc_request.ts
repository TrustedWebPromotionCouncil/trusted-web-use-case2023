import { type Kysely } from 'kysely';

export const up = async ({ schema }: Kysely<unknown>) => {
  await schema.alterTable('business_vc_request')
    .addColumn('organization', 'varchar(128)', (col) => col.notNull().defaultTo('authority-1'))
    .execute();
  await schema.alterTable('business_vc_request')
    .alterColumn('organization', (col) => col.dropDefault())
    .execute();
};

export const down = ({ schema }: Kysely<unknown>) =>
  schema.alterTable('business_vc_request')
    .dropColumn('organization')
    .execute();
