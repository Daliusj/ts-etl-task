/* eslint-disable @typescript-eslint/naming-convention */
import { createWriteStream, createReadStream } from 'fs'
import { parse } from 'csv-parse'
import { stringify } from 'csv-stringify'
import { join } from 'path'
import { TrackArtistsRelationsCamel } from '@/src/schemas/trackArtistSchema.ts'
import config from '@/src/config.ts'

export default async function explodeJoinTableCsv(
  filePath: string,
  outputFileDir: string,
  fileName: string,
): Promise<{
  success: boolean
  body: { message: string; filePath: string; fileName: string }
}> {
  return new Promise((resolve) => {
    const prefixedFileName = `${config.explodedFilePrefix}_${fileName}`
    const outputFilePath = join(outputFileDir, prefixedFileName)
    const outputStream = createWriteStream(outputFilePath)
    const inputStream = createReadStream(filePath)
    const parser = parse({ columns: true })
    const stringifier = stringify({
      header: true,
      columns: ['track_id', 'artist_id'],
    })

    inputStream
      .pipe(parser)
      .on('data', (row: TrackArtistsRelationsCamel) => {
        const { trackId } = row
        let artistIds: string[] = []

        const rawArtistIds = row.artistId.replace(/[{}]/g, '')
        artistIds = rawArtistIds
          .split(',')
          .map((id) => id.trim().replace(/'/g, ''))

        artistIds.forEach((artistId) => {
          if (artistId) {
            stringifier.write([trackId, artistId])
          }
        })
      })
      .on('end', () => {
        stringifier.end()
      })
      .on('error', (error) => {
        throw new Error(
          `Error exploading join table on input stream : ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        )
      })

    stringifier
      .pipe(outputStream)
      .on('finish', () => {
        resolve({
          success: true,
          body: {
            message: 'Processing successful',
            filePath: outputFilePath,
            fileName: prefixedFileName,
          },
        })
      })
      .on('error', (error) => {
        throw new Error(
          `Error exploading join table on output stream : ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        )
      })
  })
}
