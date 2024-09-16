import 'dotenv/config'
import { z } from 'zod'

const { env } = process

if (!env.NODE_ENV) env.NODE_ENV = 'development'

const schema = z
  .object({
    env: z.enum(['development', 'production', 'test']).default('development'),

    database: z.object({
      userName: z.string().min(1),
      password: z.string().min(1),
      endpoint: z.string().min(1),
      dbName: z.string(),
      port: z.coerce.number(),
    }),

    testDatabase: z.object({
      userName: z.string().min(1),
      password: z.string().min(1),
      endpoint: z.string().min(1),
      dbName: z.string().min(1),
    }),

    s3BucketName: z.string().min(1),
    region: z.string(),
    inputFilePath: z.string().min(1),
    outputFileDir: z.string().min(1),
    tracksFileName: z.string().min(5),
    artistsFileName: z.string().min(5),
    validatedFilePrefix: z.string().min(1),
    transformedFilePrefix: z.string().min(1),
  })
  .readonly()

const config = schema.parse({
  env: env.NODE_ENV,

  database: {
    userName: env.RDS_DB_USER,
    password: env.RDS_DB_PASSWORD,
    endpoint: env.RDS_DB_ENDPOINT,
    dbName: env.RDS_DB_NAME,
    port: env.RDS_DB_PORT,
  },

  testDatabase: {
    userName: env.TEST_DB_USER,
    password: env.TEST_DB_PASSWORD,
    endpoint: env.TEST_DB_ENDPOINT,
    dbName: env.TEST_DB_NAME,
  },

  s3BucketName: env.S3_BUCKET_NAME,
  region: env.AWS_REGION,
  inputFilePath: env.INPUT_FILE_DIR,
  outputFileDir: env.OUTPUT_FILE_DIR,
  tracksFileName: env.TRACKS_FILENAME,
  artistsFileName: env.ARTISTS_FILENAME,
  validatedFilePrefix: env.VALIDATED_FILE_PREFIX,
  transformedFilePrefix: env.TRANSFORMED_FILE_PREFIX,
})

export default config
