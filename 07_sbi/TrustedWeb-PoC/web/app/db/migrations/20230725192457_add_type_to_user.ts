import { type Kysely } from 'kysely';

export const up = ({ schema }: Kysely<unknown>) =>
  schema.alterTable('user').addColumn('type', 'varchar(128)').execute();

export const down = ({ schema }: Kysely<unknown>) => schema.alterTable('user').dropColumn('type').execute();
