import { type Kysely } from 'kysely';

export const up = ({ schema }: Kysely<unknown>) =>
  schema.createTable('auth_request_id')
    .addColumn('request_id', 'varchar(128)', (col) => col.primaryKey())
    .addColumn('challenge', 'varchar(128)', (col) => col.notNull())
    .addColumn('expired_at', 'timestamp', (col) => col.notNull())
    .execute();

export const down = ({ schema }: Kysely<unknown>) => schema.dropTable('auth_request_id').execute();
