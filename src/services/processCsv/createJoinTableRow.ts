import { TrackArtistsRelationsCamel } from '../../schemas/trackArtistSchema.ts'
import { Track } from '../../schemas/trackSchema.ts'
/* eslint-disable @typescript-eslint/naming-convention */

export default function createJoinTableRow() {
  return (data: Track): TrackArtistsRelationsCamel | null => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, id_artists } = data

    return {
      trackId: id,
      artistId: id_artists,
    }
  }
}
