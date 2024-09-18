import { z } from 'zod'
import { Selectable } from 'kysely'
import { Artists } from '../database/types.ts'

export const artistSchema = z
  .object({
    id: z.string().min(1),
    followers: z.string(),
    genres: z.string(),
    name: z.string().min(1),
    popularity: z.string(),
  })
  .strip()

export type Artist = {
  [K in keyof z.infer<typeof artistSchema>]: string
}

export const artistKeys = Object.keys(artistSchema.shape) as (keyof Artists)[]

export type ArtistPublic = Pick<
  Selectable<Artists>,
  (typeof artistKeys)[number]
>
