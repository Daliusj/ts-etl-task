import { Track, trackSchema } from '../../schemas/trackValidationSchema'
import config from '../../../config'
import createProcessCsv from '../../utils/createCsvProcessor'
import validateRow from './validateRow'
import transformTrackRow from './transformTrackRow'
import { Artist, artistSchema } from '../../schemas/artistValidationSchema'

export const validateTracksCsv = createProcessCsv(
  validateRow<Track>(trackSchema),
  config.validatedFilePrefix,
)

export const validateArtistsCsv = createProcessCsv(
  validateRow<Artist>(artistSchema),
  config.validatedFilePrefix,
)

export const transformTrackCsv = createProcessCsv(
  transformTrackRow(),
  config.transformedFilePrefix,
)
