/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('artists')
    .addColumn('id', 'varchar(255)', (c) => c.primaryKey())
    .addColumn('name', 'text', (c) => c.notNull())
    .addColumn('followers', 'integer')
    .addColumn('popularity', 'integer')
    .addColumn('genres', sql`text[]`)
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute()

  await db.schema
    .createTable('tracks')
    .addColumn('id', 'varchar(255)', (c) => c.primaryKey())
    .addColumn('name', 'text', (c) => c.notNull())
    .addColumn('popularity', 'integer', (c) => c.notNull())
    .addColumn('duration_ms', 'integer', (c) => c.notNull())
    .addColumn('explicit', 'integer', (c) => c.notNull())
    .addColumn('energy', 'numeric', (c) => c.notNull())
    .addColumn('key', 'integer', (c) => c.notNull())
    .addColumn('loudness', 'numeric', (c) => c.notNull())
    .addColumn('mode', 'integer', (c) => c.notNull())
    .addColumn('speechiness', 'numeric', (c) => c.notNull())
    .addColumn('acousticness', 'numeric', (c) => c.notNull())
    .addColumn('instrumentalness', 'numeric', (c) => c.notNull())
    .addColumn('liveness', 'numeric', (c) => c.notNull())
    .addColumn('valence', 'numeric', (c) => c.notNull())
    .addColumn('tempo', 'numeric', (c) => c.notNull())
    .addColumn('time_signature', 'integer', (c) => c.notNull())
    .addColumn('year', 'integer', (c) => c.notNull())
    .addColumn('month', 'integer', (c) => c.notNull())
    .addColumn('day', 'integer', (c) => c.notNull())
    .addColumn('danceability', 'text', (c) => c.notNull())
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute()

  await db.schema
    .createTable('track_artists')
    .addColumn('track_id', 'varchar(255)', (c) => c.notNull())
    .addColumn('artist_id', 'varchar(255)', (c) => c.notNull())
    .addForeignKeyConstraint('fk_track', ['track_id'], 'tracks', ['id'])
    .addForeignKeyConstraint('fk_artist', ['artist_id'], 'artists', ['id'])
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('artists').execute()
  await db.schema.dropTable('tracks').execute()
  await db.schema.dropTable('track_artist').execute()
}
