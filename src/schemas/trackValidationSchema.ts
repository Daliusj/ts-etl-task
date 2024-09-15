import { z } from 'zod'

export const trackSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  popularity: z.coerce.number().nonnegative(),
  duration_ms: z.coerce.number().min(60000),
  explicit: z.coerce.number(),
  artists: z.string(),
  id_artists: z.string().min(1),
  release_date: z.union([z.string(), z.coerce.number()]),
  danceability: z.coerce.number(),
  energy: z.coerce.number(),
  key: z.coerce.number(),
  loudness: z.coerce.number(),
  mode: z.coerce.number(),
  speechiness: z.coerce.number(),
  acousticness: z.coerce.number(),
  instrumentalness: z.coerce.number(),
  liveness: z.coerce.number(),
  valence: z.coerce.number(),
  tempo: z.coerce.number(),
  time_signature: z.coerce.number(),
})

export type Track = {
  [K in keyof z.infer<typeof trackSchema>]: string
}
export const transformedTrackSchema = trackSchema.extend({
  year: z.coerce.number(),
  month: z.coerce.number(),
  day: z.coerce.number(),
  danceability_category: z.string(),
})

export type TransformedTrack = {
  [K in keyof z.infer<typeof transformedTrackSchema>]: string
}
