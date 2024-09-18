import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Readable } from 'node:stream'
import { Repository } from '@/src/repository/index.ts'
import config from '@/src/config.ts'

const s3 = new S3Client({ region: config.region })

export default async function loadS3ToDb(
  repository: Repository,
  bucketName: string,
  key: string,
) {
  try {
    await repository.createTempTable()
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key })
    const response = await s3.send(command)
    const s3Stream = response.Body as Readable
    await repository.copyStreamToTempTable(s3Stream)
    await repository.copyToProdTable()
  } catch (error) {
    throw new Error(
      `Load to database error : ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
    )
  }
}
