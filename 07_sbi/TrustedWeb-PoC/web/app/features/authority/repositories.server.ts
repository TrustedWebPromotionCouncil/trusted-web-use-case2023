import { dbRead } from '~/db/db.server';

export const getAuthorityIdByName = (name: string) =>
  dbRead
    .selectFrom('authority')
    .select('id')
    .where('name', '=', name)
    .executeTakeFirstOrThrow();
