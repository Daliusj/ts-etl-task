/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await sql`
  CREATE VIEW track_details_with_artist_followers AS
	SELECT t.id, t.name, t.popularity, energy, danceability, sum(followers) as followers_sum
	FROM tracks t
		JOIN track_artists ta ON t.id = ta.track_id
		JOIN artists a ON a.id = ta.artist_id
	GROUP BY
	 	t.id, t.name, t.popularity, t.energy, t.danceability;
  `.execute(db)

  await sql`
  CREATE VIEW tracks_with_follower AS
  SELECT *
  FROM track_details_with_artist_followers
  WHERE followers_sum > 0
  `.execute(db)

  await sql`
  CREATE VIEW most_energising_track_per_year AS
  SELECT t.id, t.name, t.energy, t.year, t.popularity
  FROM tracks t
  JOIN
    (SELECT year, MAX(energy) AS max_energy
    FROM tracks
    GROUP BY year) max_energy_per_year
  ON
    t.year = max_energy_per_year.year
    AND t.energy = max_energy_per_year.max_energy
  ORDER BY
    t.year DESC,
    t.popularity
  `.execute(db)
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('artists').dropColumn('time_signature').execute()
  await db.schema
    .alterTable('artists')
    .addColumn('followers', 'integer', (c) => c.notNull())
    .execute()
}
