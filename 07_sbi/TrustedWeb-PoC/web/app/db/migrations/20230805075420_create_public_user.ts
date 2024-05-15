import { type Kysely, sql } from 'kysely';

export const up = ({ schema }: Kysely<unknown>) =>
  schema
    .createTable('public_user')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(128)', (col) => col.notNull().unique())
    .addColumn('password', 'varchar(128)', (col) => col.notNull())
    .addColumn('public', 'int4', (col) => col.references('public.id').onDelete('cascade').notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

export const down = ({ schema }: Kysely<unknown>) => schema.dropTable('public_user').execute();
