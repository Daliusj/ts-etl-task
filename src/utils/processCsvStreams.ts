/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-underscore-dangle */
import { Readable, Transform, Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import parseCsvRow from './parseCsvRow.ts'

export type ProcessRow<T, U extends object = {}> = (data: T) => T | U | null

export const csvToObjects = <T>(header: string, rows: string[]): T[] => {
  const headers = parseCsvRow(header)
  return rows.map((row) => {
    const values = parseCsvRow(row)
    return headers.reduce((obj, hdr, index) => {
      const value = values[index]
      const formattedValue = value === '[]' ? '{}' : value
      return {
        ...obj,
        [hdr]: formattedValue,
      }
    }, {} as T)
  })
}

const objectsToCsv = <T>(objects: T[], headersOn: boolean): string => {
  if (objects.length === 0) {
    return ''
  }
  const headers = Object.keys(objects[0] as {})
  const headerRow = headers.join(',')
  const rows = objects.map((obj) =>
    headers
      .map((header) => {
        const value = (obj as Record<string, string>)[header]
        if (/[,"\n]/.test(value)) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      })
      .join(','),
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
        this.push(`${rowsProcessed}\n`)
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
