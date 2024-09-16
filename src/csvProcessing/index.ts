import config from '@/config.ts'
import {
  validateTracksCsv,
  validateArtistsCsv,
  transformTrackCsv,
} from './processCsv/index.ts'
import uploadS3 from './uploadS3/index.ts'

export default async function runProcessingStack() {
  try {
    const tracksValidationResult = await validateTracksCsv(
      config.inputFilePath,
      config.outputFileDir,
      config.tracksFileName,
    )
    const artistsValidationResult = await validateArtistsCsv(
      config.inputFilePath,
      config.outputFileDir,
      config.artistsFileName,
    )

    if (
      tracksValidationResult.success &&
      tracksValidationResult.body.filePath
    ) {
      const tracksTransformResult = await transformTrackCsv(
        config.outputFileDir,
        config.outputFileDir,
        tracksValidationResult.body.fileName,
      )
      if (
        tracksTransformResult.success &&
        artistsValidationResult.success &&
        tracksTransformResult.body.filePath &&
        artistsValidationResult.body.filePath
      ) {
        const tracksUploadS3Result = await uploadS3(
          config.s3BucketName,
          tracksTransformResult.body.filePath,
          tracksTransformResult.body.fileName,
        )
        const artistsUploadS3Result = await uploadS3(
          config.s3BucketName,
          artistsValidationResult.body.filePath,
          artistsValidationResult.body.fileName,
        )
      }
    }
  } catch (error) {
    throw new Error(
      `File proccesing failed, ${error instanceof Error ? error.message : 'Unknown error occurred'} `,
    )
  }
}
