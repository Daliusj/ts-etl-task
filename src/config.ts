import 'dotenv/config'
import { z } from 'zod'

const { env } = process

if (!env.NODE_ENV) env.NODE_ENV = 'development'

const schema = z
  .object({
    env: z.enum(['development', 'production', 'test']).default('development'),

    database: z.object({
      connectionString: z.string().url(),
    }),

    testDatabase: z.object({
      connectionString: z.string().url(),
    }),

    s3BucketName: z.string().min(1),
    region: z.string(),
    inputFileDir: z.string().min(1),
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
    connectionString: env.DATABASE_URL,
  },

  testDatabase: {
    connectionString: env.TEST_DATABASE,
  },

  s3BucketName: env.S3_BUCKET_NAME,
  region: env.AWS_REGION,
  inputFileDir: env.INPUT_FILE_DIR,
  outputFileDir: env.OUTPUT_FILE_DIR,
  tracksFileName: env.TRACKS_FILENAME,
  artistsFileName: env.ARTISTS_FILENAME,
  validatedFilePrefix: env.VALIDATED_FILE_PREFIX,
  transformedFilePrefix: env.TRANSFORMED_FILE_PREFIX,
})

export default config
