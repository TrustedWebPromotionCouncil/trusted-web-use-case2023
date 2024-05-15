import { type Kysely } from 'kysely';
import { type DB } from 'kysely-codegen';
import { overwriteOrNothing, type SeedOptions } from '../seed';

export const seed = async (db: Kysely<DB>, { clear, overwrite }: SeedOptions) => {
  if (clear) {
    await db.deleteFrom('authority_user').execute();
    await db.deleteFrom('business_user').execute();
    await db.deleteFrom('public_user').execute();
    await db.deleteFrom('revoke_user').execute();
  } else {
    await db
      .insertInto('authority_user')
      .values([{
        id: 1,
        name: 'authority1',
        password: 'pass',
        authority: (await db.selectFrom('authority').select('id').where('id', '=', 1).executeTakeFirstOrThrow()).id,
      }])
      .onConflict((oc) => overwriteOrNothing(!!overwrite, oc.column('id'), { name: (eb) => eb.ref('excluded.name') }))
      .execute();
    await db
      .insertInto('business_user')
      .values([{
        id: 1,
        name: 'business1',
        password: 'pass',
        business: (await db.selectFrom('business').select('id').where('id', '=', 1).executeTakeFirstOrThrow()).id,
      }])
      .onConflict((oc) => overwriteOrNothing(!!overwrite, oc.column('id'), { name: (eb) => eb.ref('excluded.name') }))
      .execute();
    await db
      .insertInto('public_user')
      .values([{
        id: 1,
        name: 'public1',
        password: 'pass',
        public: (await db.selectFrom('public').select('id').where('id', '=', 1).executeTakeFirstOrThrow()).id,
      }])
      .onConflict((oc) => overwriteOrNothing(!!overwrite, oc.column('id'), { name: (eb) => eb.ref('excluded.name') }))
      .execute();
    await db
      .insertInto('revoke_user')
      .values([{
        id: 1,
        name: 'revoke1',
        password: 'pass',
        revoke: (await db.selectFrom('revoke').select('id').where('id', '=', 1).executeTakeFirstOrThrow()).id,
      }])
      .onConflict((oc) => overwriteOrNothing(!!overwrite, oc.column('id'), { name: (eb) => eb.ref('excluded.name') }))
      .execute();
  }
};
