/* eslint-disable @typescript-eslint/naming-convention */

import { Track, TransformedTrack } from '@/src/schemas/trackSchema.ts'

export default function transformRow() {
  return (data: Track): TransformedTrack | null => {
    const releaseDate = new Date(data.release_date)
    const year = `${releaseDate.getFullYear()}`
    const month = `${releaseDate.getMonth() + 1}`
    const day = `${releaseDate.getDate()}`

    let danceability_category: string
    if (Number(data.danceability) < 0.5) {
      danceability_category = 'Low'
    } else if (Number(data.danceability) <= 0.6) {
      danceability_category = 'Medium'
    } else {
      danceability_category = 'High'
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { release_date, artists, id_artists, danceability, ...rest } = data

    return {
      ...rest,
      year,
      month,
      day,
      danceability: danceability_category,
    }
  }
}
