import { z } from 'zod'

export const trackArtistsRelationsSchemaSnake = z.object({
  track_id: z.string().min(1),
  artist_id: z.string().min(1),
})

export const trackArtistsRelationsSchemaCamel = z.object({
  trackId: z.string().min(1),
  artistId: z.string().min(1),
})

export type TrackArtistsRelationsSnake = {
  [K in keyof z.infer<typeof trackArtistsRelationsSchemaSnake>]: string
}
export type TrackArtistsRelationsCamel = {
  [K in keyof z.infer<typeof trackArtistsRelationsSchemaCamel>]: string
}

export const trackArtistsRelationsKeys = Object.keys(
  trackArtistsRelationsSchemaSnake.shape,
) as (keyof TrackArtistsRelationsSnake)[]
