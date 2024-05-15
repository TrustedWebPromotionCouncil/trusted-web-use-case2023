import { type Kysely } from 'kysely';
import { type DB } from 'kysely-codegen';
import { getUpstreamUrlBase } from '~/features/corda/api';
import { overwriteOrNothing, type SeedOptions } from '../seed';

export const seed = async (
  db: Kysely<DB>,
  { clear, overwrite }: SeedOptions,
) => {
  if (clear) {
    await db.deleteFrom('public').execute();
  } else {
    await db
      .insertInto('public')
      .values([
        {
          id: 1,
          name: 'VCAuthCom1',
          corda_upstream_url: getUpstreamUrlBase('public'),
          display_org_name: 'JP Accreditation Organization',
        },
      ])
      .onConflict((oc) =>
        overwriteOrNothing(!!overwrite, oc.column('id'), {
          name: (eb) => eb.ref('excluded.name'),
          corda_upstream_url: (eb) => eb.ref('excluded.corda_upstream_url'),
        })
      )
      .execute();
  }
};
