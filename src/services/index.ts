import explodeJoinTableCSV from './processCsv/explodeJoinTableCsv.ts'
import config from '../config.ts'
import { createDatabase } from '../database/index.ts'
import { repository } from '../repository/index.ts'
import { artistKeys } from '../schemas/artistSchema.ts'
import { trackArtistsRelationsKeys } from '../schemas/trackArtistSchema.ts'
import { trackKeys } from '../schemas/trackSchema.ts'
import loadS3ToDb from './loadDb/index.ts'
import filterUmatchedRowsCsv from './processCsv/filterUmatchedRowsCsv.ts'
import {
  validateTracksCsv,
  validateArtistsCsv,
  createJoinTableCsv,
  transformTrackCsv,
} from './processCsv/index.ts'
import uploadS3 from './uploadS3/index.ts'

export const validateCsv = async () => {
  try {
    console.log('validating...')
    const tracksValidationResult = await validateTracksCsv(
      '/home/dalius/Desktop/spotify-etl/tracks.csv',
      config.outputFileDir,
      config.tracksFileName,
    )

    const artistsValidationResult = await validateArtistsCsv(
      '/home/dalius/Desktop/spotify-etl/artists.csv',
      config.outputFileDir,
      config.artistsFileName,
    )
    return { tracksValidationResult, artistsValidationResult }
  } catch (error) {
    throw new Error(
      `Csv validation error : ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
    )
  }
}

export const createJoinTable = async (validatedTracksPath: string) => {
  try {
    console.log('creating join table...')
    const createJoinTableResults = await createJoinTableCsv(
      validatedTracksPath,
      config.outputFileDir,
      config.tracksFileName,
      'join_track_artists.csv',
    )

    const explodedJoinTableResults = await explodeJoinTableCSV(
      createJoinTableResults.body.filePath,
      config.outputFileDir,
      createJoinTableResults.body.fileName,
    )
    return { createJoinTableResults, explodedJoinTableResults }
  } catch (error) {
    throw new Error(
      `Creating join table error : ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
    )
  }
}

export const transformCsv = async (
  validatedTracksPath: string,
  validatedTracksFileName: string,
) => {
  try {
    console.log('transforming...')
    const tracksTransformedResult = await transformTrackCsv(
      validatedTracksPath,
      config.outputFileDir,
      validatedTracksFileName,
    )
    return tracksTransformedResult
  } catch (error) {
    throw new Error(
      `Transforming csv error : ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
    )
  }
}

export const filterCsv = async (
  joinTablePath: string,
  joinTableFileName: string,
  validatedArtistsPath: string,
  validatedArtistsFileName: string,
) => {
  try {
    console.log('filtering...')
    const filteredArtistsResult = await filterUmatchedRowsCsv(
      joinTablePath,
      validatedArtistsPath,
      'artist_id',
      'id',
      config.outputFileDir,
      'fltr',
      validatedArtistsFileName,
    )
    const filteredJoinTableResult = await filterUmatchedRowsCsv(
      validatedArtistsPath,
      joinTablePath,
      'id',
      'artist_id',
      config.outputFileDir,
      'fltr',
      joinTableFileName,
    )
    return { filteredArtistsResult, filteredJoinTableResult }
  } catch (error) {
    throw new Error(
      `Filtering csv error : ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
    )
  }
}

export const uploadToS3 = async (
  tracksPath: string,
  tracksFileName: string,
  artistsPath: string,
  artistsFileName: string,
  joinTablePath: string,
  joinTableFileName: string,
) => {
  try {
    console.log('uploading to s3...')
    const tracksUploadS3Result = await uploadS3(
      config.s3BucketName,
      tracksPath,
      tracksFileName,
    )

    const artistsUploadS3Result = await uploadS3(
      config.s3BucketName,
      artistsPath,
      artistsFileName,
    )

    const joinTableUploadS3Result = await uploadS3(
      config.s3BucketName,
      joinTablePath,
      joinTableFileName,
    )
    return {
      tracksUploadS3Result,
      artistsUploadS3Result,
      joinTableUploadS3Result,
    }
  } catch (error) {
    throw new Error(
      `Uploading to s3 error : ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
    )
  }
}

export const loadToDbFromS3 = async (
  tracksS3Key: string,
  artistsS3Key: string,
  joinTableS3Key: string,
) => {
  const { db, pool } = createDatabase(config.database)
  try {
    console.log('uploading to db...')
    const artistsRepo = repository(db, pool, 'artists', artistKeys)
    const tracksRepo = repository(db, pool, 'tracks', trackKeys)
    const joinTableRepo = repository(
      db,
      pool,
      'track_artists',
      trackArtistsRelationsKeys,
    )

    await loadS3ToDb(tracksRepo, config.s3BucketName, tracksS3Key)
    await loadS3ToDb(artistsRepo, config.s3BucketName, artistsS3Key)
    await loadS3ToDb(joinTableRepo, config.s3BucketName, joinTableS3Key)
    console.log('ETL process completed')
  } catch (error) {
    throw new Error(
      `Loading to database: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
    )
  } finally {
    try {
      await db.destroy()
    } catch (destroyError) {
      // eslint-disable-next-line no-console
      console.error(
        `Failed to destroy the database connection: ${destroyError instanceof Error ? destroyError.message : 'Unknown error occurred'}`,
      )
    }
  }
}
