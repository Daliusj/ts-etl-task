import { describe, expect, beforeEach, it } from 'vitest'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'
import uploadS3 from '../index.ts'

const s3Mock = mockClient(S3Client)

describe('uploadS3', () => {
  const bucketName = 'test-bucket'
  const filePath = `/home/dalius/Projects/telesoftas/ts-etl-task/src/utils/tests/fakes/fake_transformed_tracks.csv`
  const key = 'test-file.csv'

  beforeEach(() => {
    s3Mock.reset()
  })

  it('should upload file to S3 successfully', async () => {
    s3Mock.on(PutObjectCommand).resolves({
      $metadata: { httpStatusCode: 200 },
    })

    const result = await uploadS3(bucketName, filePath, key)

    expect(result.success).toBeTruthy()

    expect(s3Mock.call(0).args[0]).toBeInstanceOf(PutObjectCommand)
    expect(s3Mock.call(0).args[0].input).toEqual({
      Bucket: bucketName,
      Key: key,
      Body: expect.any(Object),
      ContentType: 'text/csv',
    })
  })

  it('should handle error during file upload', async () => {
    s3Mock.on(PutObjectCommand).rejects(new Error('Upload failed'))
    await expect(uploadS3(bucketName, filePath, key)).rejects.toThrow(
      'S3 upload error: Upload failed',
    )
  })
})
