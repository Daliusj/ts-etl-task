/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema.alterTable('tracks').dropColumn('time_signature').execute()
  await db.schema
    .alterTable('tracks')
    .addColumn('time_signature', 'text', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('tracks').dropColumn('time_signature').execute()
  await db.schema
    .alterTable('tracks')
    .addColumn('time_signature', 'integer', (c) => c.notNull())
    .execute()
}
