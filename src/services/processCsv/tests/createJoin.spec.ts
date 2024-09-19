import * as fs from 'node:fs'
import { promises as fsPromises } from 'fs'
import { afterEach, it, expect, describe, beforeEach } from 'vitest'
import moment from 'moment'
import { deleteFiles } from '@/src/utils/tests/testUtils.ts'
import { createJoinTableCsv, explodeJoinTableCsv } from '../index.ts'
import config from '@/src/config.ts'
import {
  outputDir,
  validatedTrackPath,
  validatedTracksName,
  joinName,
  joinPath,
  exploadedJoinPath,
} from './paths.ts'

describe('createJoinTableCsv', () => {
  let timestamp: string

  beforeEach(() => {
    timestamp = moment().format('YYYYMMDD_HHmmss')
  })
  afterEach(async () =>
    deleteFiles(
      `${outputDir}${config.validatedFilePrefix}_${timestamp}_${joinName}`,
    )(),
  )

  it('should return join table csv', async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    const response = await createJoinTableCsv(
      validatedTrackPath,
      outputDir,
      validatedTracksName,
      joinName,
    )
    expect(response.success).toBeTruthy()

    const fileContent = (
      await fsPromises.readFile(
        `${outputDir}${config.validatedFilePrefix}_${timestamp}_${joinName}`,
      )
    ).toString()

    const expectedContent = await fsPromises.readFile(joinPath, 'utf-8')
    expect(fileContent).toEqual(expectedContent)
  })
})

describe('ExplodeJoinTableCsv', () => {
  afterEach(async () =>
    deleteFiles(`${outputDir}${config.explodedFilePrefix}_${joinName}`)(),
  )

  it('should return exploded join table csv', async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    const response = await explodeJoinTableCsv(joinPath, outputDir, joinName)
    expect(response.success).toBeTruthy()

    const fileContent = (
      await fsPromises.readFile(
        `${outputDir}${config.explodedFilePrefix}_${joinName}`,
      )
    ).toString()

    const expectedContent = await fsPromises.readFile(
      exploadedJoinPath,
      'utf-8',
    )
    expect(fileContent).toEqual(expectedContent)
  })
})
