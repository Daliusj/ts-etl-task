import { describe, expect, it, beforeEach, afterAll } from 'vitest'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'
import { sdkStreamMixin } from '@smithy/util-stream'
import { createReadStream } from 'node:fs'
import { sql } from 'kysely'
import { createTestDatabase } from '@/src/tests/database.ts'
import { artistKeys } from '@/src/schemas/artistSchema.ts'
import { trackKeys } from '@/src/schemas/trackSchema.ts'
import { trackArtistsRelationsKeys } from '@/src/schemas/trackArtistSchema.ts'
import { repository } from '@/src/repository/index.ts'
import { clearTables } from '@/src/tests/records.ts'
import loadS3ToDb from '../index.ts'

const s3Mock = mockClient(S3Client)
const testDb = createTestDatabase()
const artistsRepo = repository(testDb.db, testDb.pool, 'artists', artistKeys)
const tracksRepo = repository(testDb.db, testDb.pool, 'tracks', trackKeys)
const joinTableRepo = repository(
  testDb.db,
  testDb.pool,
  'track_artists',
  trackArtistsRelationsKeys,
)

const fakeBucketName = 'bucket-name'

export const trackPath =
  '/home/dalius/Projects/telesoftas/ts-etl-task/src/utils/tests/fakes/fake_transformed_tracks.csv'
export const tracksName = `fake_transformed_tracks.csv`

export const artistsPath =
  '/home/dalius/Projects/telesoftas/ts-etl-task/src/utils/tests/fakes/fake_filtered_artists.csv'
export const artistsName = `fake_filtered_artists.csv`

export const joinPath =
  '/home/dalius/Projects/telesoftas/ts-etl-task/src/utils/tests/fakes/fake_filtered_join.csv'
export const joinName = `fake_filtered_join.csv`

describe('uploadToDb', () => {
  beforeEach(() => s3Mock.reset())
  afterAll(() => clearTables(testDb.db, ['tracks', 'artists', 'trackArtists']))

  it('should upload tracks from s3 to db successfully', async () => {
    const stream = createReadStream(trackPath)
    const sdkStream = sdkStreamMixin(stream)
    s3Mock.on(GetObjectCommand).resolves({
      Body: sdkStream,
    })
    await loadS3ToDb(tracksRepo, fakeBucketName, tracksName)
    const data = await sql`SELECT * FROM tracks`.execute(testDb.db)
    expect(data.rows.length).toBeGreaterThan(0)

    expect(s3Mock.call(0).args[0]).toBeInstanceOf(GetObjectCommand)
    expect(s3Mock.call(0).args[0].input).toEqual({
      Bucket: fakeBucketName,
      Key: tracksName,
    })
  })
  it('should upload artists from s3 to db successfully', async () => {
    const stream = createReadStream(artistsPath)
    const sdkStream = sdkStreamMixin(stream)
    s3Mock.on(GetObjectCommand).resolves({
      Body: sdkStream,
    })
    await loadS3ToDb(artistsRepo, fakeBucketName, artistsName)
    const data = await sql`SELECT * FROM artists`.execute(testDb.db)
    expect(data.rows.length).toBeGreaterThan(0)

    expect(s3Mock.call(0).args[0]).toBeInstanceOf(GetObjectCommand)
    expect(s3Mock.call(0).args[0].input).toEqual({
      Bucket: fakeBucketName,
      Key: artistsName,
    })
  })
  it('should upload join ids from s3 to db successfully', async () => {
    const stream = createReadStream(joinPath)
    const sdkStream = sdkStreamMixin(stream)
    s3Mock.on(GetObjectCommand).resolves({
      Body: sdkStream,
    })
    await loadS3ToDb(joinTableRepo, fakeBucketName, joinName)
    const data = await sql`SELECT * FROM track_artists`.execute(testDb.db)
    expect(data.rows.length).toBeGreaterThan(0)

    expect(s3Mock.call(0).args[0]).toBeInstanceOf(GetObjectCommand)
    expect(s3Mock.call(0).args[0].input).toEqual({
      Bucket: fakeBucketName,
      Key: joinName,
    })
  })
})

await testDb.db.destroy()
