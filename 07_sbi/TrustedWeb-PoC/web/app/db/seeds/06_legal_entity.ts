import { type Kysely } from 'kysely';
import { type DB } from 'kysely-codegen';
import { overwriteOrNothing, type SeedOptions } from '../seed';

export const seed = async (
  db: Kysely<DB>,
  { clear, overwrite }: SeedOptions,
) => {
  if (clear) {
    await db.deleteFrom('legal_entity').execute();
  } else {
    await db
      .insertInto('legal_entity')
      .values([{ id: 1, name: 'SBI Holdings', number: '6010401045208', location: '1-6-1 Roppongi, Minato-ku, Tokyo' }])
      .onConflict((oc) =>
        overwriteOrNothing(!!overwrite, oc.column('id'), {
          name: (eb) => eb.ref('excluded.name'),
          number: (eb) => eb.ref('excluded.number'),
          location: (eb) => eb.ref('excluded.location'),
        })
      )
      .execute();
    await db.updateTable('business').set({ legal_entity_id: 1 }).execute();
  }
};
