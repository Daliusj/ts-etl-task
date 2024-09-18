import config from './config.ts'
import { createDatabase } from './database/index.ts'
import loadS3ToDb from './services/loadDb/index.ts'
import { repository } from './repository/index.ts'
import { artistKeys } from './schemas/artistSchema.ts'
import { trackKeys } from './schemas/trackSchema.ts'
import {
  validateTracksCsv,
  validateArtistsCsv,
  transformTrackCsv,
  createTrackArtistsCsv as createJoinTableCsv,
} from './services/processCsv/index.ts'
import uploadS3 from './services/uploadS3/index.ts'
import explodeJoinTableCSV from './services/processCsv/explodeJoinTableCsv.ts'
import { trackArtistsRelationsKeys } from './schemas/trackArtistSchema.ts'
import filterCsv from './services/processCsv/filterCsv.ts'

console.log('validating tracks...')
const tracksValidationResult = await validateTracksCsv(
  '/home/dalius/Desktop/spotify-etl/tracks.csv',
  config.outputFileDir,
  config.tracksFileName,
)

console.log('validating artists...')
const artistsValidationResult = await validateArtistsCsv(
  '/home/dalius/Desktop/spotify-etl/artists.csv',
  config.outputFileDir,
  config.artistsFileName,
)
console.log('transforming tracks to relations...')
const createJoinTableResults = await createJoinTableCsv(
  tracksValidationResult.body.filePath,
  config.outputFileDir,
  config.tracksFileName,
  'track-artists.csv',
)

console.log('exploadding tracks artists relations...')

const explodedJoinTableResults = await explodeJoinTableCSV(
  createJoinTableResults.body.filePath,
  config.outputFileDir,
  createJoinTableResults.body.fileName,
)

if (
  tracksValidationResult.success &&
  tracksValidationResult.body.filePath &&
  createJoinTableResults.body.filePath
) {
  const tracksTransformResult = await transformTrackCsv(
    tracksValidationResult.body.filePath,
    config.outputFileDir,
    tracksValidationResult.body.fileName,
  )

  const filteredArtistsResult = await filterCsv(
    explodedJoinTableResults.body.filePath,
    artistsValidationResult.body.filePath,
    'artist_id',
    'id',
    config.outputFileDir,
    'fltr',
    artistsValidationResult.body.fileName,
  )

  const filteredJoinTableResult = await filterCsv(
    artistsValidationResult.body.filePath,
    explodedJoinTableResults.body.filePath,
    'id',
    'artist_id',
    config.outputFileDir,
    'fltr',
    explodedJoinTableResults.body.fileName,
  )

  console.log('transforming tracks...')
  if (
    tracksTransformResult.success &&
    filteredArtistsResult.success &&
    filteredJoinTableResult.success
  ) {
    console.log('uploading tracks to s3...')
    const tracksUploadS3Result = await uploadS3(
      config.s3BucketName,
      tracksTransformResult.body.filePath,
      tracksTransformResult.body.fileName,
    )

    console.log('uploading artists to s3...')
    const artistsUploadS3Result = await uploadS3(
      config.s3BucketName,
      filteredArtistsResult.body.filePath,
      filteredArtistsResult.body.fileName,
    )

    console.log('uploading trackArtists to s3...')
    const trackArtistsUploadS3Result = await uploadS3(
      config.s3BucketName,
      filteredJoinTableResult.body.filePath,
      filteredJoinTableResult.body.fileName,
    )

    if (
      artistsUploadS3Result.body.response.Key &&
      tracksUploadS3Result.body.response.Key &&
      trackArtistsUploadS3Result.body.response.Key
    ) {
      // Load to Database
      const { db, pool } = createDatabase(config.database)
      const artistsRepo = repository(db, pool, 'artists', artistKeys)
      const tracksRepo = repository(db, pool, 'tracks', trackKeys)
      const trackArtistsRepo = repository(
        db,
        pool,
        'track_artists',
        trackArtistsRelationsKeys,
      )

      console.log('uploading tracks to db...')
      await loadS3ToDb(
        tracksRepo,
        config.s3BucketName,
        tracksUploadS3Result.body.response.Key,
      )
      console.log('uploading artists to db...')
      await loadS3ToDb(
        artistsRepo,
        config.s3BucketName,
        artistsUploadS3Result.body.response.Key,
      )
      console.log('uploading trackArtists to db...')
      await loadS3ToDb(
        trackArtistsRepo,
        config.s3BucketName,
        trackArtistsUploadS3Result.body.response.Key,
      )
      await db.destroy()
    }
  }
}
