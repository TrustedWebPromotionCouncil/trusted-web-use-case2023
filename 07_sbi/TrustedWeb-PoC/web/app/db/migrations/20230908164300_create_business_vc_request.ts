import { type Kysely } from 'kysely';

export const up = ({ schema }: Kysely<unknown>) =>
  schema.createTable('business_vc_request')
    .addColumn('request_id', 'varchar(128)', (col) => col.primaryKey())
    .addColumn('uuid', 'varchar(36)', (col) => col.notNull())
    .addColumn('vc', 'json', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull())
    .execute();

export const down = ({ schema }: Kysely<unknown>) => schema.dropTable('business_vc_request').execute();
