import { type Kysely } from 'kysely';

export const up = ({ schema }: Kysely<unknown>) =>
  schema.createTable('business_vc_request_history')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('business', 'int4', (col) => col.references('business.id').onDelete('cascade').notNull())
    .addColumn('sequence', 'int4', (col) => col.notNull())
    .addColumn('country', 'varchar(30)', (col) => col.notNull())
    .addColumn('address', 'varchar(200)', (col) => col.notNull())
    .addColumn('address_included_in_vc', 'boolean', (col) => col.notNull())
    .addColumn('contact_person', 'varchar(30)', (col) => col.notNull())
    .addColumn('contact_number', 'varchar(20)', (col) => col.notNull())
    .addColumn('contact_info_included_in_vc', 'boolean', (col) => col.notNull())
    .addColumn('legal_entity_identifier', 'varchar(30)', (col) => col.notNull())
    .addColumn('legal_entity_name', 'varchar(50)', (col) => col.notNull())
    .addColumn('legal_entity_location', 'varchar(200)', (col) => col.notNull())
    .addColumn('applied_authentication_level', 'int2', (col) => col.notNull())
    .addColumn('status', 'varchar(30)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.notNull())
    .addUniqueConstraint('business_sequence', ['business', 'sequence'])
    .execute();

export const down = ({ schema }: Kysely<unknown>) => schema.dropTable('business_vc_request_history').execute();
