import { z } from 'zod'

export const artistSchema = z.object({
  id: z.string().min(1),
  followers: z.string(),
  genres: z.string(),
  name: z.string().min(1),
  popularity: z.string(),
})

export type Artist = {
  [K in keyof z.infer<typeof artistSchema>]: string
}
