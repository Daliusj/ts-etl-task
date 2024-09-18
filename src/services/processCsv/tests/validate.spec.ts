import * as fs from 'node:fs'
import { promises as fsPromises } from 'fs'
import { afterEach, it, expect, describe, beforeEach } from 'vitest'
import moment from 'moment'
import { deleteFiles } from '@/src/utils/tests/testUtils.ts'
import { validateTracksCsv, validateArtistsCsv } from '../index.ts'
import config from '@/src/config.ts'
import {
  outputDir,
  tracksName,
  trackPath,
  validatedTrackPath,
  artistsName,
  artistPath,
  validatedArtistsPath,
} from './paths.ts'

describe('validateTracksCsv', () => {
  let timestamp: string

  beforeEach(() => {
    timestamp = moment().format('YYYYMMDD_HHmmss')
  })

  afterEach(async () =>
    deleteFiles(
      `${outputDir}${config.validatedFilePrefix}_${timestamp}_${tracksName}`,
    )(),
  )

  it('should return validated tracks CSV', async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    const response = await validateTracksCsv(trackPath, outputDir, tracksName)
    expect(response.success).toBeTruthy()

    const fileContent = (
      await fsPromises.readFile(
        `${outputDir}${config.validatedFilePrefix}_${timestamp}_${tracksName}`,
      )
    ).toString()

    const expectedContent = await fsPromises.readFile(
      validatedTrackPath,
      'utf-8',
    )
    expect(fileContent).toEqual(expectedContent)
  })
})

describe('validateArtistsCsv', () => {
  let timestamp: string

  beforeEach(() => {
    timestamp = moment().format('YYYYMMDD_HHmmss')
  })
  afterEach(async () =>
    deleteFiles(
      `${outputDir}${config.validatedFilePrefix}_${timestamp}_${artistsName}`,
    )(),
  )

  it('should return validated artists CSV', async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    const response = await validateArtistsCsv(
      artistPath,
      outputDir,
      artistsName,
    )
    expect(response.success).toBeTruthy()

    const fileContent = (
      await fsPromises.readFile(
        `${outputDir}${config.validatedFilePrefix}_${timestamp}_${artistsName}`,
      )
    ).toString()

    const expectedContent = await fsPromises.readFile(
      validatedArtistsPath,
      'utf-8',
    )
    expect(fileContent).toEqual(expectedContent)
  })
})
