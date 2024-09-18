import {
  validateCsv,
  createJoinTable,
  transformCsv,
  filterCsv,
  uploadToS3,
  loadToDbFromS3,
} from './services/index.ts'

const { tracksValidationResult, artistsValidationResult } = await validateCsv()

const { explodedJoinTableResults } = await createJoinTable(
  tracksValidationResult.body.filePath,
)

const tracksTransformedResult = await transformCsv(
  tracksValidationResult.body.filePath,
  tracksValidationResult.body.fileName,
)

const { filteredArtistsResult, filteredJoinTableResult } = await filterCsv(
  explodedJoinTableResults.body.filePath,
  explodedJoinTableResults.body.fileName,
  artistsValidationResult.body.filePath,
  artistsValidationResult.body.fileName,
)

const { tracksUploadS3Result, artistsUploadS3Result, joinTableUploadS3Result } =
  await uploadToS3(
    tracksTransformedResult.body.filePath,
    tracksTransformedResult.body.fileName,
    filteredArtistsResult.body.filePath,
    filteredArtistsResult.body.fileName,
    filteredJoinTableResult.body.filePath,
    filteredJoinTableResult.body.fileName,
  )

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
