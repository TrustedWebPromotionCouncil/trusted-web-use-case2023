import { type Kysely } from 'kysely';

export const up = async ({ schema }: Kysely<unknown>) => {
  await schema.alterTable('authority').addColumn('corda_upstream_url', 'varchar', (ac) => ac.notNull()).execute();
  await schema.alterTable('public').addColumn('corda_upstream_url', 'varchar', (ac) => ac.notNull()).execute();
  await schema.alterTable('revoke').addColumn('corda_upstream_url', 'varchar', (ac) => ac.notNull()).execute();
};

export const down = async ({ schema }: Kysely<unknown>) => {
  await schema.alterTable('authority').dropColumn('corda_upstream_url').execute();
  await schema.alterTable('public').dropColumn('corda_upstream_url').execute();
  await schema.alterTable('revoke').dropColumn('corda_upstream_url').execute();
};
