import { type Kysely } from 'kysely';
import { type DB } from 'kysely-codegen';
import { overwriteOrNothing, type SeedOptions } from '../seed';

export const seed = async (
  db: Kysely<DB>,
  { clear, overwrite }: SeedOptions,
) => {
  if (clear) {
    await db.deleteFrom('business').execute();
  } else {
    await db
      .insertInto('business')
      .values([{ id: 1, name: 'tokyofactory' }])
      .onConflict((oc) =>
        overwriteOrNothing(!!overwrite, oc.column('id'), {
          name: (eb) => eb.ref('excluded.name'),
        })
      )
      .execute();
  }
};
