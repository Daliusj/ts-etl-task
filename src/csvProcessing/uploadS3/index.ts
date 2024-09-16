import config from '@/src/config.ts'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import * as fs from 'fs'

const s3 = new S3Client({ region: config.region })

export default async function uploadS3(
  bucketName: string,
  filePath: string,
  key: string,
) {
  try {
    const fileStream = fs.createReadStream(filePath)

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: fileStream,
        ContentType: 'text/csv',
      },
    })

    upload.on('httpUploadProgress', (progress) => {
      console.log(`Uploaded ${progress.loaded} out of ${progress.total} bytes.`)
    })

    const response = await upload.done()

    return {
      success: true,
      body: {
        message: 'Upload succesfull',
        response,
      },
    }
  } catch (error) {
    throw new Error(
      `S3 upload error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
    )
  }
}
