import { program } from 'commander';
import { promises as fs, readdirSync, statSync, writeFileSync } from 'fs';
import { FileMigrationProvider, type MigrationResultSet, Migrator } from 'kysely';
import * as path from 'path';
import { dbConnection } from './db.server';

const MIGRATION_FOLDER = 'app/db/migrations';
const SEED_FOLDER = 'app/db/seeds';

const MIGRATION_TEMPLATE = `import { type Kysely } from 'kysely'

export const up = ({ schema }: Kysely<unknown>) => {
}

export const down = ({ schema }: Kysely<unknown>) => {
}
`;

const SEED_TEMPLATE = `import { type Kysely } from 'kysely';
import { type DB } from 'kysely-codegen';
import { type SeedOptions } from '../seed';

export const seed = async (db: Kysely<DB>, { clear, overwrite }: SeedOptions) => {
  if (clear) {
  } else {
  }
}
`;

const printResultsAndExitIfError = ({ error, results }: MigrationResultSet) => {
  results?.forEach(({ status, migrationName }) => {
    switch (status) {
      case 'Success':
        console.log(`migration "${migrationName}" was executed successfully`);
        break;
      case 'Error':
        console.error(`failed to execute migration "${migrationName}"`);
        break;
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }
};

(async () => {
  const db = dbConnection();
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({ fs, path, migrationFolder: MIGRATION_FOLDER }),
  });

  program.command('rollback')
    .action(async () => {
      const result = await migrator.migrateDown();
      printResultsAndExitIfError(result);
    });

  program.command('latest')
    .action(async () => {
      const result = await migrator.migrateToLatest();
      printResultsAndExitIfError(result);
    });

  program.command('reset')
    .action(async () => {
      const migrations = await migrator.getMigrations();
      const count = migrations.filter(({ executedAt }) => executedAt != null).length;
      for (let i = 0; i < count; ++i) {
        const result = await migrator.migrateDown();
        printResultsAndExitIfError(result);
      }
    });

  program.command('create')
    .argument('<input-file>')
    .action(async (name) => {
      const dateStr = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
      const fileName = `${MIGRATION_FOLDER}/${dateStr}_${name}.ts`;
      writeFileSync(fileName, MIGRATION_TEMPLATE, 'utf8');
    });

  program.command('createseed')
    .argument('<input-file>')
    .action(async (name) => {
      const fileName = `${SEED_FOLDER}/${name}.ts`;
      writeFileSync(fileName, SEED_TEMPLATE, 'utf8');
    });

  program.command('seed')
    .option('-c, --clear')
    .option('-o, --overwrite')
    .action(async (options) => {
      const fileNames = readdirSync(SEED_FOLDER);

      for (let i = 0; i < fileNames.length; ++i) {
        const fullPath = path.join(SEED_FOLDER, fileNames[i]);
        const stats = statSync(fullPath);
        if (stats.isFile()) {
          const module = await import(fullPath);
          try {
            await module.seed(db, options);
          } catch (error) {
            console.error(error);
          }
        }
      }
    });

  await program.parseAsync();

  await db.destroy();
})();
