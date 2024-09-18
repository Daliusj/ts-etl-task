import * as fs from 'node:fs'
import { promises as fsPromises } from 'fs'
import { afterEach, it, expect, describe, beforeEach } from 'vitest'
import moment from 'moment'
import { deleteFiles } from '@/src/utils/tests/testUtils.ts'
import { transformTrackCsv } from '../index.ts'
import config from '@/src/config.ts'
import {
  outputDir,
  validatedTrackPath,
  validatedTracksName,
  transformedTrackPath,
} from './paths.ts'

describe('transformTrackCsv', () => {
  let timestamp: string

  beforeEach(() => {
    timestamp = moment().format('YYYYMMDD_HHmmss')
  })
  afterEach(async () =>
    deleteFiles(
      `${outputDir}${config.transformedFilePrefix}_${timestamp}_${validatedTracksName}`,
    )(),
  )

  it('should return transformed tracks CSV', async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    const response = await transformTrackCsv(
      validatedTrackPath,
      outputDir,
      validatedTracksName,
    )
    expect(response.success).toBeTruthy()

    const fileContent = (
      await fsPromises.readFile(
        `${outputDir}${config.transformedFilePrefix}_${timestamp}_${validatedTracksName}`,
      )
    ).toString()

    const expectedContent = await fsPromises.readFile(
      transformedTrackPath,
      'utf-8',
    )
    expect(fileContent).toEqual(expectedContent)
  })
})
