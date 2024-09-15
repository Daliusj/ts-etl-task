import { z } from 'zod'

export const artistSchema = z.object({
  id: z.string().min(1),
  followers: z.coerce.number().nonnegative(),
  genres: z.string(),
  name: z.string().min(1),
  popularity: z.coerce.number(),
})

export type Artist = {
  [K in keyof z.infer<typeof artistSchema>]: string
}
