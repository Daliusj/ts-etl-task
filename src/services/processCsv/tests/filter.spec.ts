import * as fs from 'node:fs'
import { promises as fsPromises } from 'fs'
import { afterEach, it, expect, describe } from 'vitest'
import { deleteFiles } from '@/src/utils/tests/testUtils.ts'
import { filterUmatchedRowsCsv } from '../index.ts'
import {
  outputDir,
  validatedArtistsPath,
  exploadedJoinPath,
  validatedArtistsName,
  exploadedJoinName,
  filteredArtistsPath,
  filteredJoinPath,
} from './paths.ts'
import config from '@/src/config.ts'

describe('FilterUnmachedRows', () => {
  afterEach(async () => {
    await deleteFiles(
      `${outputDir}${config.filteredFilePrefix}_${validatedArtistsName}`,
    )()
    await deleteFiles(
      `${outputDir}${config.filteredFilePrefix}_${exploadedJoinName}`,
    )()
  })

  it('should return filtered artists table csv', async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    const response = await filterUmatchedRowsCsv(
      exploadedJoinPath,
      validatedArtistsPath,
      'artist_id',
      'id',
      outputDir,
      config.filteredFilePrefix,
      validatedArtistsName,
    )
    expect(response.success).toBeTruthy()

    const fileContent = (
      await fsPromises.readFile(
        `${outputDir}${config.filteredFilePrefix}_${validatedArtistsName}`,
      )
    ).toString()

    const expectedContent = await fsPromises.readFile(
      filteredArtistsPath,
      'utf-8',
    )
    expect(fileContent).toEqual(expectedContent)
  })

  it('should return filtered join table csv', async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    const response = await filterUmatchedRowsCsv(
      validatedArtistsPath,
      exploadedJoinPath,
      'id',
      'artist_id',
      outputDir,
      config.filteredFilePrefix,
      exploadedJoinName,
    )
    expect(response.success).toBeTruthy()

    const fileContent = (
      await fsPromises.readFile(
        `${outputDir}${config.filteredFilePrefix}_${exploadedJoinName}`,
      )
    ).toString()
    const expectedContent = await fsPromises.readFile(filteredJoinPath, 'utf-8')
    expect(fileContent).toEqual(expectedContent)
  })
})
