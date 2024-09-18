/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql, type Kysely, SqliteAdapter } from 'kysely'
import { DB } from '../database/types.ts'

type DatabaseTypes<N extends keyof DB> = { [P in N]: DB[P] }

/**
 * Clears the records from the specified tables in the database.
 * If the database is SQLite, it deletes all records from the tables.
 * If the database is PostgreSQL, it truncates all tables.
 */
export const clearTables = async <
  N extends keyof DB,
  T extends DatabaseTypes<N>,
>(
  db: Kysely<T>,
  tableNames: N[],
): Promise<void> => {
  // if SQLite, just delete all records
  if (db.getExecutor().adapter instanceof SqliteAdapter) {
    await Promise.all(
      tableNames.map((tableName) =>
        sql`DELETE FROM ${sql.table(tableName)};`.execute(db),
      ),
    )

    return
  }

  // assume PostgreSQL, truncate all tables
  const tableNamesSql = sql.join(tableNames.map(sql.table), sql.raw(', '))

  await sql`TRUNCATE TABLE ${tableNamesSql} CASCADE;`.execute(db)
}
