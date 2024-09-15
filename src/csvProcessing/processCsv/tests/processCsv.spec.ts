import * as fs from 'node:fs'
import { promises as fsPromises } from 'fs'
import { deleteFiles } from '../../../utils/tests/testUtils'
import {
  validateTracksCsv,
  transformTrackCsv,
  validateArtistsCsv,
} from '../index'

const mockTracksCsvDir = `${__dirname}/../../../../src/utils/tests/fakes/`
const mockTracksName = `fakeTracks.csv`
const mockArtistsCsvPath = `${__dirname}/../../../../src/utils/tests/fakes/fakeArtists.csv`
const mockValidatedTracksCsvPath = `${__dirname}/../../../../src/utils/tests/fakes/fakeTracksValidated.csv`
const mockTransformedTracksCsvPath = `${__dirname}/../../../../src/utils/tests/fakes/fakeTracksTransformed.csv`
const outputDir = `${__dirname}/`

describe('validateTracksCsv', () => {
  afterEach(async () => deleteFiles(`${outputDir}processed-fakeTracks.csv`)())

  it('should return validated tracks CSV', async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    const response = await validateTracksCsv(
      mockTracksCsvDir,
      outputDir,
      mockTracksName,
    )

    expect(response.success).toBeTruthy()

    const fileContent = await fsPromises.readFile(
      `${outputDir}processed-fakeTracks.csv`,
    )

    const expectedContent = await fsPromises.readFile(
      mockValidatedTracksCsvPath,
      'utf-8',
    )
    expect(fileContent).toEqual(expectedContent)
  })
})

describe('validateArtistsCsv', () => {
  afterEach(async () => deleteFiles(`${outputDir}processed-fakeArtists.csv`)())

  it('should return validated tracks CSV', async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    const response = await validateArtistsCsv(mockTracksCsvDir, outputDir)

    expect(response.statusCode).toBe(200)

    const fileContent = await fsPromises.readFile(
      `${outputDir}processed-fakeTracks.csv`,
    )

    const expectedContent = await fsPromises.readFile(
      mockValidatedTracksCsvPath,
      'utf-8',
    )
    expect(fileContent).toEqual(expectedContent)
  })
})

describe('transformTrackCsv', () => {
  afterEach(async () => deleteFiles(`${outputDir}processed-fakeTracks.csv`)())

  it('should return transformed tracks CSV', async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    const response = await transformTrackCsv(
      mockValidatedTracksCsvPath,
      outputDir,
    )

    expect(response.statusCode).toBe(200)

    const fileContent = await fsPromises.readFile(
      `${outputDir}processed-fakeTracks.csv`,
    )

    const expectedContent = await fsPromises.readFile(
      mockTransformedTracksCsvPath,
      'utf-8',
    )
    expect(fileContent).toEqual(expectedContent)
  })
})
