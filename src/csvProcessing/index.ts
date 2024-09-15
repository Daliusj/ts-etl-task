import config from '../../config'
import {
  validateTracksCsv,
  transformTrackCsv,
  validateArtistsCsv,
} from './processCsv'

export default async function runProcessingStack() {
  try {
    const tracksValidation = await validateTracksCsv(
      config.inputFilePath,
      config.outputFileDir,
      config.tracksFileName,
    )
    if (tracksValidation.success && tracksValidation.body.filePath)
      await transformTrackCsv(
        tracksValidation.body.filePath,
        config.outputFileDir,
        tracksValidation.body.fileName,
      )

    const artistsValidation = await validateArtistsCsv(
      config.inputFilePath,
      config.outputFileDir,
      config.artistsFileName,
    )
  } catch (error) {
    throw new Error(
      `File proccesing failed, ${error instanceof Error ? error.message : 'Unknown error occurred'} `,
    )
  }
}
