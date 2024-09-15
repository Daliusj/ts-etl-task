import { createReadStream, createWriteStream } from 'fs'
import processCsvStreams from './processCsvStreams'

export default function createCsvProcessor<T>(
  processRow: (...args: T[]) => T | null,
  outputFilePrefix: string,
) {
  return async (inputDir: string, outputDir: string, fileName: string) => {
    try {
      const outputFileName = `${outputFilePrefix}-${fileName}`
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
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'

      return {
        success: false,
        body: {
          message: 'Processing failed',
          error: errorMessage,
        },
      }
    }
  }
}
