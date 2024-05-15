import { type Kysely, sql } from 'kysely';

export const up = ({ schema }: Kysely<unknown>) => schema.dropTable('user').execute();

export const down = ({ schema }: Kysely<unknown>) =>
  schema
    .createTable('user')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('type', 'varchar(128)')
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();
