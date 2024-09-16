import { Artist, artistSchema } from '@/src/schemas/artistValidationSchema.ts'
import { Track, trackSchema } from '@/src/schemas/trackValidationSchema.ts'
import transformTrackRow from './transformTrackRow.ts'
import createRowValidator from './validateRow.ts'
import config from '@/config.ts'
import createCsvProcessor from '@/src/utils/createCsvProcessor.ts'

export const validateTracksCsv = createCsvProcessor(
  createRowValidator<Track>(trackSchema),
  config.validatedFilePrefix,
)

export const validateArtistsCsv = createCsvProcessor(
  createRowValidator<Artist>(artistSchema),
  config.validatedFilePrefix,
)

export const transformTrackCsv = createCsvProcessor(
  transformTrackRow(),
  config.transformedFilePrefix,
)
