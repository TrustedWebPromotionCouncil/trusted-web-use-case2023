import { Kysely, PostgresDialect, type Transaction } from 'kysely';
import { type DB } from 'kysely-codegen';
import { Pool } from 'pg';

export const dbConnection = () => {
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({ pool: new Pool({ connectionString: process.env['DATABASE_URL'] }) }),
    log(event) {
      switch (event.level) {
        case 'query': {
          console.log(event.query.sql);
          console.log(event.query.parameters);
          break;
        }
        case 'error': {
          console.error(event.error);
        }
      }
    },
  });

  return db;
};

export const dbRead = dbConnection();

export const dbTransaction = async <T>(service: (trx: Transaction<DB>) => Promise<T>) => {
  const db = dbConnection();

  try {
    return db.transaction().execute(service);
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await db.destroy();
  }
};
