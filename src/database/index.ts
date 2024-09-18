import {
  CamelCasePlugin,
  Kysely,
  ParseJSONResultsPlugin,
  PostgresDialect,
} from 'kysely'
import pg from 'pg'
import type { DB } from './types.ts'

export function createDatabase(options: pg.PoolConfig) {
  const pool = new pg.Pool(options)

  const db = new Kysely<DB>({
    dialect: new PostgresDialect({ pool }),
    plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
  })

  return { db, pool }
}

export type Database = Kysely<DB>
export type DatabasePartial<T> = Kysely<T>
export * from './types.ts'
