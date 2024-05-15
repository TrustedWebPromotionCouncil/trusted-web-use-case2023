import { type Kysely } from 'kysely';

export const up = ({ schema }: Kysely<unknown>) =>
  schema
    .createTable('authority')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(128)', (col) => col.notNull().unique())
    .execute();

export const down = ({ schema }: Kysely<unknown>) => schema.dropTable('authority').execute();
