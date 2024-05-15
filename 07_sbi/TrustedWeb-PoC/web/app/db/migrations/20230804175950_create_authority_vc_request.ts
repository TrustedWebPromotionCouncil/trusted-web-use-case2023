import { type Kysely } from 'kysely';

export const up = ({ schema }: Kysely<unknown>) =>
  schema
    .createTable('authority_vc_request')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('vc_id', 'varchar(36)', (col) => col.notNull())
    .addColumn('title', 'varchar(128)', (col) => col.notNull())
    .addColumn('description', 'varchar(256)')
    .addColumn('level', 'integer', (col) => col.notNull())
    .addColumn('published', 'boolean', (col) => col.notNull())
    .addColumn('country', 'varchar(256)')
    .addColumn('address', 'varchar(512)')
    .addColumn('comment', 'varchar(1024)')
    .addColumn('from_ldt', 'timestamp')
    .addColumn('to_ldt', 'timestamp')
    .addColumn('expired_ldt', 'timestamp')
    .execute();

export const down = ({ schema }: Kysely<unknown>) => schema.dropTable('authority_vc_request').execute();
