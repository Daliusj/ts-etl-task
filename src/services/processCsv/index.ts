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
import { TrackArtistsRelations } from '@/src/schemas/trackArtistSchema.ts'
import transformToTrackArtistsRelation from './transformToTrackArtistsRelations.ts'

export const validateTracksCsv = createCsvProcessor<Track, Track>(
  createRowValidator<Track>(trackSchema),
  config.validatedFilePrefix,
)

export const validateArtistsCsv = createCsvProcessor<Artist, Artist>(
  createRowValidator<Artist>(artistSchema),
  config.validatedFilePrefix,
)

export const createTrackArtistsCsv = createCsvProcessor<
  Track,
  TrackArtistsRelations
>(transformToTrackArtistsRelation(), config.validatedFilePrefix)

export const transformTrackCsv = createCsvProcessor<Track, TransformedTrack>(
  transformTrackRow(),
  config.transformedFilePrefix,
)
