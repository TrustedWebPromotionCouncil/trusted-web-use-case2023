import { type Kysely } from 'kysely';

export const up = async ({ schema }: Kysely<unknown>) => {
  await schema.alterTable('auth_request_id')
    .renameTo('auth_challenge')
    .execute();
  await schema.alterTable('auth_challenge')
    .renameColumn('request_id', 'auth_id')
    .execute();
};

export const down = async ({ schema }: Kysely<unknown>) => {
  await schema.alterTable('auth_challenge')
    .renameColumn('auth_id', 'request_id')
    .execute();
  await schema.alterTable('auth_challenge')
    .renameTo('auth_request_id')
    .execute();
};
