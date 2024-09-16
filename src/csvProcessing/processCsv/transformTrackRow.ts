import { Track, TransformedTrack } from '@/src/schemas/trackValidationSchema.ts'

export default function transformRow() {
  return (data: Track): TransformedTrack | null => {
    const releaseDate = new Date(data.release_date)
    const year = `${releaseDate.getFullYear()}`
    const month = `${releaseDate.getMonth() + 1}`
    const day = `${releaseDate.getDate()}`

    // eslint-disable-next-line @typescript-eslint/naming-convention
    let danceability_category: string
    if (Number(data.danceability) < 0.5) {
      danceability_category = 'Low'
    } else if (Number(data.danceability) <= 0.6) {
      danceability_category = 'Medium'
    } else {
      danceability_category = 'High'
    }

    return {
      ...data,
      year,
      month,
      day,
      danceability_category,
    }
  }
}
