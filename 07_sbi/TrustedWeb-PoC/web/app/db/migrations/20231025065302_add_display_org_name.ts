import { type Kysely } from 'kysely';

export const up = ({ schema }: Kysely<unknown>) => {
  schema.alterTable('authority').addColumn(
    'display_org_name',
    'varchar(128)',
    (col) => col.notNull().defaultTo('JP Digital Certification Organization 1'),
  ).execute();
  schema.alterTable('authority').alterColumn('display_org_name', (col) => col.dropDefault()).execute();
  schema.alterTable('public').addColumn(
    'display_org_name',
    'varchar(128)',
    (col) => col.notNull().defaultTo('JP Accreditation Organization'),
  ).execute();
  schema.alterTable('public').alterColumn('display_org_name', (col) => col.dropDefault()).execute();
  schema.alterTable('revoke').addColumn(
    'display_org_name',
    'varchar(128)',
    (col) => col.notNull().defaultTo('Revocation Administration Service'),
  ).execute();
  schema.alterTable('revoke').alterColumn('display_org_name', (col) => col.dropDefault()).execute();
};

export const down = ({ schema }: Kysely<unknown>) => {
  schema.alterTable('authority').dropColumn('display_org_name').execute();
  schema.alterTable('public').dropColumn('display_org_name').execute();
  schema.alterTable('revoke').dropColumn('display_org_name').execute();
};
