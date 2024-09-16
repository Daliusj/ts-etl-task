import * as fs from 'node:fs'
import { promises as fsPromises } from 'fs'
import { afterEach, it, expect, describe, beforeEach } from 'vitest'
import moment from 'moment'
import { deleteFiles } from '@/src/utils/tests/testUtils.ts'
import {
  validateTracksCsv,
  validateArtistsCsv,
  transformTrackCsv,
} from '../index.ts'
import config from '@/src/config.ts'

const mockCsvDir = `${__dirname}/../../../../src/utils/tests/fakes/`
const mockTracksName = `fakeTracks.csv`
const mockValidatedTracksName = `fakeTracksValidated.csv`
const mockValidatedTracksCsvPath = `${__dirname}/../../../../src/utils/tests/fakes/fakeTracksValidated.csv`
const mockTransformedTracksCsvPath = `${__dirname}/../../../../src/utils/tests/fakes/fakeTracksTransformed.csv`
const mockArtistsName = `fakeArtists.csv`
const mockValidatedArtistsCsvPath = `${__dirname}/../../../../src/utils/tests/fakes/fakeArtistsValidated.csv`
const outputDir = `${__dirname}/`

describe('validateTracksCsv', () => {
  let timestamp: string

  beforeEach(() => {
    timestamp = moment().format('YYYYMMDD_HHmmss')
  })

  afterEach(
    async () =>
      await deleteFiles(
        `${outputDir}${config.validatedFilePrefix}_${timestamp}_${mockTracksName}`,
      )(),
  )

  it('should return validated tracks CSV', async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    const response = await validateTracksCsv(
      mockCsvDir,
      outputDir,
      mockTracksName,
    )
    expect(response.success).toBeTruthy()

    const fileContent = (
      await fsPromises.readFile(
        `${outputDir}${config.validatedFilePrefix}_${timestamp}_${mockTracksName}`,
      )
    ).toString()

    const expectedContent = await fsPromises.readFile(
      mockValidatedTracksCsvPath,
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
  afterEach(
    async () =>
      await deleteFiles(
        `${outputDir}${config.validatedFilePrefix}_${timestamp}_${mockArtistsName}`,
      )(),
  )

  it('should return validated artists CSV', async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    const response = await validateArtistsCsv(
      mockCsvDir,
      outputDir,
      mockArtistsName,
    )
    expect(response.success).toBeTruthy()

    const fileContent = (
      await fsPromises.readFile(
        `${outputDir}${config.validatedFilePrefix}_${timestamp}_${mockArtistsName}`,
      )
    ).toString()

    const expectedContent = await fsPromises.readFile(
      mockValidatedArtistsCsvPath,
      'utf-8',
    )
    expect(fileContent).toEqual(expectedContent)
  })
})

describe('transformTrackCsv', () => {
  let timestamp: string

  beforeEach(() => {
    timestamp = moment().format('YYYYMMDD_HHmmss')
  })
  afterEach(
    async () =>
      await deleteFiles(
        `${outputDir}${config.transformedFilePrefix}_${timestamp}_${mockValidatedTracksName}`,
      )(),
  )

  it('should return transformed tracks CSV', async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    const response = await transformTrackCsv(
      mockCsvDir,
      outputDir,
      mockValidatedTracksName,
    )
    expect(response.success).toBeTruthy()

    const fileContent = (
      await fsPromises.readFile(
        `${outputDir}${config.transformedFilePrefix}_${timestamp}_${mockValidatedTracksName}`,
      )
    ).toString()

    const expectedContent = await fsPromises.readFile(
      mockTransformedTracksCsvPath,
      'utf-8',
    )
    expect(fileContent).toEqual(expectedContent)
  })
})
