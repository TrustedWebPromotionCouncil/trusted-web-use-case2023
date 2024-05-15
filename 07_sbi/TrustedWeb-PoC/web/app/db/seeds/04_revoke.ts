import { type Kysely } from 'kysely';
import { type DB } from 'kysely-codegen';
import { getUpstreamUrlBase } from '~/features/corda/api';
import { overwriteOrNothing, type SeedOptions } from '../seed';

export const seed = async (
  db: Kysely<DB>,
  { clear, overwrite }: SeedOptions,
) => {
  if (clear) {
    await db.deleteFrom('revoke').execute();
  } else {
    await db
      .insertInto('revoke')
      .values([
        {
          id: 1,
          name: 'VCAuthOrgConsortium000001',
          corda_upstream_url: getUpstreamUrlBase('revoke'),
          display_org_name: 'Revocation Administration Service',
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
