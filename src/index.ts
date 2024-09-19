import config from './config.ts'
import {
  validateCsv,
  createJoinTable,
  transformCsv,
  filterCsv,
  uploadToS3,
  loadToDbFromS3,
} from './services/index.ts'
import { deleteFiles } from './utils/deleteFile.ts'

const { tracksValidationResult, artistsValidationResult } = await validateCsv()

const { createJoinTableResults, explodedJoinTableResults } =
  await createJoinTable(tracksValidationResult.body.filePath)

const tracksTransformedResult = await transformCsv(
  tracksValidationResult.body.filePath,
  tracksValidationResult.body.fileName,
)
if (config.deletStepResults) {
  await deleteFiles(tracksValidationResult.body.filePath)()
}

const { filteredArtistsResult, filteredJoinTableResult } = await filterCsv(
  explodedJoinTableResults.body.filePath,
  explodedJoinTableResults.body.fileName,
  artistsValidationResult.body.filePath,
  artistsValidationResult.body.fileName,
)

if (config.deletStepResults) {
  await deleteFiles(
    createJoinTableResults.body.filePath,
    explodedJoinTableResults.body.filePath,
    artistsValidationResult.body.filePath,
  )()
}

const { tracksUploadS3Result, artistsUploadS3Result, joinTableUploadS3Result } =
  await uploadToS3(
    tracksTransformedResult.body.filePath,
    tracksTransformedResult.body.fileName,
    filteredArtistsResult.body.filePath,
    filteredArtistsResult.body.fileName,
    filteredJoinTableResult.body.filePath,
    filteredJoinTableResult.body.fileName,
  )

if (config.deletStepResults) {
  await deleteFiles(
    tracksTransformedResult.body.filePath,
    filteredArtistsResult.body.filePath,
    filteredJoinTableResult.body.filePath,
  )()
}

if (
  tracksUploadS3Result.body.response.Key &&
  artistsUploadS3Result.body.response.Key &&
  joinTableUploadS3Result.body.response.Key
)
  await loadToDbFromS3(
    tracksUploadS3Result.body.response.Key,
    artistsUploadS3Result.body.response.Key,
    joinTableUploadS3Result.body.response.Key,
  )
