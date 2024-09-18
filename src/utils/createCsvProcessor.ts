import { createReadStream, createWriteStream } from 'fs'
import moment from 'moment'
import processCsvStreams from './processCsvStreams.ts'

export default function createCsvProcessor<T, U extends object>(
  processRow: (...args: T[]) => U | null,
  outputFilePrefix: string,
) {
  return async (
    inputFilePath: string,
    outputDir: string,
    fileName: string,
    outputName?: string,
  ) => {
    try {
      const timestamp = moment().format('YYYYMMDD_HHmmss')
      const outputFileName = outputName
        ? `${outputFilePrefix}_${timestamp}_${outputName}`
        : `${outputFilePrefix}_${timestamp}_${fileName}`
      const outputFilePath = `${outputDir}${outputFileName}`
      const inputStream = createReadStream(inputFilePath)
      const outputStream = createWriteStream(outputFilePath)

      await processCsvStreams<T>(inputStream, outputStream, processRow)

      return {
        success: true,
        body: {
          message: 'Processing succesfull',
          filePath: outputFilePath,
          fileName: outputFileName,
        },
      }
    } catch (error) {
      throw new Error(
        `Csv proccessing error : ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
      )
    }
  }
}
