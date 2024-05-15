import { type Kysely } from 'kysely';

export const up = async ({ schema }: Kysely<unknown>) => {
  await schema
    .createTable('legal_entity')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(128)', (col) => col.notNull())
    .addColumn('number', 'varchar(128)', (col) => col.notNull().unique())
    .addColumn('location', 'varchar')
    .execute();
  await schema
    .alterTable('business')
    .addColumn('legal_entity_id', 'int4', (ac) => ac.references('legal_entity.id').onDelete('set null'))
    .execute();
};

export const down = async ({ schema }: Kysely<unknown>) => {
  await schema.alterTable('business').dropColumn('legal_entity_id').execute();
  await schema.dropTable('legal_entity').execute();
};
