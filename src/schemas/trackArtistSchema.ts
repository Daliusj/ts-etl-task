import { z } from 'zod'

export const trackArtistsRelationsSchema = z.object({
  track_id: z.string().min(1),
  artist_id: z.string().min(1),
})

export type TrackArtistsRelations = {
  [K in keyof z.infer<typeof trackArtistsRelationsSchema>]: string
}

export const trackArtistsRelationsKeys = Object.keys(
  trackArtistsRelationsSchema.shape,
) as (keyof TrackArtistsRelations)[]
