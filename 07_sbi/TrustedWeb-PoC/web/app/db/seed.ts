import { type OnConflictBuilder } from 'kysely';
import { type DB } from 'kysely-codegen';

export type SeedOptions = {
  clear?: boolean;
  overwrite?: boolean;
};

export const overwriteOrNothing = <TB extends keyof DB, TOCB extends OnConflictBuilder<DB, TB>>(
  overwrite: boolean,
  oc: TOCB,
  update: Parameters<TOCB['doUpdateSet']>[0],
) => overwrite ? oc.doUpdateSet(update) : oc.doNothing();
