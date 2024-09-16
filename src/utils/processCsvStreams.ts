/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-underscore-dangle */
import { Readable, Transform, Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

export type ProcessRow<T, U extends object = {}> = (data: T) => T | U | null

export const csvToObjects = <T>(header: string, rows: string[]): T[] => {
  const headers = header.split(',').map((header) => header.trim())
  const data = rows.map((row) => row.split(','))
  return data.map((row) => {
    const obj = {} as T
    headers.forEach((headLabel, index) => {
      ;(obj as Record<string, string>)[headLabel] = row[index]
    })
    return obj
  })
}

const objectsToCsv = <T>(objects: T[], headersOn: boolean): string => {
  if (objects.length === 0) {
    return ''
  }
  const headers = Object.keys(objects[0] as {})
  const headerRow = headers.join(',')
  const rows = objects.map((obj) =>
    headers.map((header) => (obj as Record<string, string>)[header]).join(','),
  )
  return headersOn ? [headerRow, ...rows].join('\n') : rows.join('\n')
}

class CsvTransform<T> extends Transform {
  private remainder = ''

  private header = ''

  private processRow: ProcessRow<T>

  private isFirstPush = true

  constructor(processRow: ProcessRow<T>) {
    super({ decodeStrings: false })
    this.processRow = processRow
  }

  _transform(chunk: Buffer, encoding: BufferEncoding, callback: Function) {
    const content = this.remainder + chunk.toString()
    const rows = content.split('\n')

    if (this.isFirstPush) {
      ;[this.header] = rows
      const dataRows = rows.slice(1)

      this.remainder = dataRows.pop() || ''

      const rowsObjects = csvToObjects<T>(this.header, dataRows)

      const objectsProcessed = rowsObjects
        .map(this.processRow)
        .filter((row): row is T => row !== null && row !== undefined)

      const rowsProcessed = objectsToCsv<T>(objectsProcessed, this.isFirstPush)
      if (rowsProcessed) {
        this.push(`${rowsProcessed}\n`)
        this.isFirstPush = false
      }
    } else {
      this.remainder = rows.pop() || ''
      const rowsObjects = csvToObjects<T>(this.header, rows)

      const objectsProcessed: T[] = rowsObjects
        .map(this.processRow)
        .filter((row): row is T => row !== null && row !== undefined)

      const rowsProcessed = objectsToCsv<T>(objectsProcessed, this.isFirstPush)
      if (rowsProcessed) {
        this.push(`${rowsProcessed}`)
      }
    }

    callback()
  }

  _flush(callback: Function) {
    if (this.remainder) {
      const rowsObjects = csvToObjects<T>(this.header, [this.remainder])
      const objectsProcessed: T[] = rowsObjects
        .map(this.processRow)
        .filter((row): row is T => row !== null && row !== undefined)
      this.push(objectsToCsv(objectsProcessed, false))
    }
    this.remainder = ''
    this.header = ''
    this.isFirstPush = true

    callback()
  }
}

export default async function processCsvStreams<T>(
  sourceStream: Readable,
  destinationStream: Writable,
  processRow: ProcessRow<T>,
) {
  return pipeline(sourceStream, new CsvTransform(processRow), destinationStream)
}
