import { writeFile } from 'fs/promises'
import { createReadStream, createWriteStream } from 'node:fs'
import * as fs from 'fs/promises'
import processCsvStreams from '../processCsvStreams.ts'
import { deleteFiles, formCsvContent, processRow } from './testUtils.ts'
import { afterEach, it, expect } from 'vitest'
/* eslint-disable no-underscore-dangle */

const sourcePath = `${__dirname}/test.csv`
const destinationPath = `${__dirname}/test.csv.gz`
const { original, expected } = formCsvContent(100)

afterEach(deleteFiles(sourcePath, destinationPath))

it('should process CSV file successfully', async () => {
  await writeFile(sourcePath, original)
  const sourceStream = createReadStream(sourcePath)
  const destinationStream = createWriteStream(destinationPath)
  await processCsvStreams(sourceStream, destinationStream, processRow)
  const content = (await fs.readFile(destinationPath)).toString()
  const lines = content.split('\n')
  const linesExpected = expected.split('\n')
  expect(lines.length).toBe(linesExpected.length)
  expect(content).toBe(expected)
})

it('handles empty CSV files', async () => {
  await writeFile(sourcePath, '')
  const sourceStream = createReadStream(sourcePath)
  const destinationStream = createWriteStream(destinationPath)
  await processCsvStreams(sourceStream, destinationStream, processRow)
  const content = (await fs.readFile(destinationPath)).toString()
  expect(content).toBe('')
})

it('handles CSV files without trailing new line', async () => {
  await writeFile(sourcePath, original.slice(0, -1))
  const sourceStream = createReadStream(sourcePath)
  const destinationStream = createWriteStream(destinationPath)
  await processCsvStreams(sourceStream, destinationStream, processRow)
  const content = (await fs.readFile(destinationPath)).toString()
  const lines = content.split('\n')
  const linesExpected = expected.slice(0, -1).split('\n')
  expect(lines.length).toBe(linesExpected.length)
  expect(content).toBe(expected.slice(0, -1))
})
