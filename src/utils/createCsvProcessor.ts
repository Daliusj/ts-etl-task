import { createReadStream, createWriteStream } from 'fs'
import processCsvStreams from './processCsvStreams'
import moment from 'moment'

export default function createCsvProcessor<T>(
  processRow: (...args: T[]) => T | null,
  outputFilePrefix: string,
) {
  return async (inputDir: string, outputDir: string, fileName: string) => {
    try {
      const timestamp = moment().format('YYYYMMDD_HHmmss')
      const outputFileName = `${outputFilePrefix}_${timestamp}_${fileName}`
      const outputFilePath = `${outputDir}${outputFileName}`

      const inputStream = createReadStream(`${inputDir}${fileName}`)
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
        `Csv proccessingerror : ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
      )
    }
  }
}
