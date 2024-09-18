/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema.alterTable('artists').dropColumn('followers').execute()
  await db.schema
    .alterTable('artists')
    .addColumn('followers', 'numeric', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('artists').dropColumn('time_signature').execute()
  await db.schema
    .alterTable('artists')
    .addColumn('followers', 'integer', (c) => c.notNull())
    .execute()
}
