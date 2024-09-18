import { Artist, artistSchema } from '@/src/schemas/artistSchema.ts'

import transformTrackRow from './transformTrackRow.ts'
import createRowValidator from './validateRow.ts'
import config from '@/src/config.ts'
import createCsvProcessor from '@/src/utils/createCsvProcessor.ts'
import {
  Track,
  trackSchema,
  TransformedTrack,
} from '@/src/schemas/trackSchema.ts'
import { TrackArtistsRelationsCamel } from '@/src/schemas/trackArtistSchema.ts'
import createJoinTableCsvRow from './createJoinTableRow.ts'

export const validateTracksCsv = createCsvProcessor<Track, Track>(
  createRowValidator<Track>(trackSchema),
  config.validatedFilePrefix,
)

export const validateArtistsCsv = createCsvProcessor<Artist, Artist>(
  createRowValidator<Artist>(artistSchema),
  config.validatedFilePrefix,
)

export const createJoinTableCsv = createCsvProcessor<
  Track,
  TrackArtistsRelationsCamel
>(createJoinTableCsvRow(), config.validatedFilePrefix)

export const transformTrackCsv = createCsvProcessor<Track, TransformedTrack>(
  transformTrackRow(),
  config.transformedFilePrefix,
)
