import { type Kysely } from 'kysely';

export const up = ({ schema }: Kysely<unknown>) =>
  schema
    .createTable('vc_request')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('title', 'varchar(128)', (col) => col.notNull())
    .addColumn('description', 'varchar(256)')
    .addColumn('level', 'integer', (col) => col.notNull())
    .addColumn('published', 'boolean', (col) => col.notNull())
    .addColumn('country', 'varchar(256)')
    .addColumn('address', 'varchar(512)')
    .addColumn('comment', 'varchar(1024)')
    .execute();

export const down = ({ schema }: Kysely<unknown>) => schema.dropTable('vc_request').execute();
