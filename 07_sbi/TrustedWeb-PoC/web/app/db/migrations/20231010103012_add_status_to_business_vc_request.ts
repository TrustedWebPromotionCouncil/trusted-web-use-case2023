import { type Kysely } from 'kysely';

export const up = ({ schema }: Kysely<unknown>) =>
  schema.alterTable('business_vc_request')
    .addColumn('status', 'varchar(30)', (ac) => ac.notNull().defaultTo('APPROVED'))
    .execute();

export const down = ({ schema }: Kysely<unknown>) =>
  schema.alterTable('business_vc_request')
    .dropColumn('status')
    .execute();
