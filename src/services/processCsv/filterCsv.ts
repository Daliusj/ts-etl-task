import * as fs from 'fs'
import * as path from 'path'
import parseCsvRow from '@/src/utils/parseCsvRow.ts'

export default async function filterCsv(
  file1Path: string,
  file2Path: string,
  file1Key: string,
  file2Key: string,
  outputDir: string,
  outputPrefix: string,
  outputFileName: string,
): Promise<{
  success: boolean
  body: { message: string; filePath: string; fileName: string }
}> {
  const lookup = new Set<string>()

  await new Promise<void>((resolve, reject) => {
    const file1Stream = fs.createReadStream(file1Path)
    const chunks: string[] = []
    file1Stream.on('data', (chunk) => chunks.push(chunk.toString()))
    file1Stream.on('end', () => {
      const file1Content = chunks.join('')
      const rows = file1Content.split('\n')
      const headers = parseCsvRow(rows[0])
      const keyIndex = headers.indexOf(file1Key)

      if (keyIndex === -1) {
        reject(new Error(`Key "${file1Key}" not found in file1`))
        return
      }

      rows
        .slice(1)
        .map((row) => parseCsvRow(row))
        .forEach((values) => lookup.add(values[keyIndex]))

      resolve()
    })
    file1Stream.on('error', reject)
  })

  const outputPath = path.join(outputDir, `${outputPrefix}_${outputFileName}`)

  const writeStream = fs.createWriteStream(outputPath)
  let headersWritten = false

  await new Promise<void>((resolve, reject) => {
    const file2Stream = fs.createReadStream(file2Path)
    const chunks: string[] = []
    file2Stream.on('data', (chunk) => chunks.push(chunk.toString()))
    file2Stream.on('end', () => {
      const file2Content = chunks.join('')
      const rows = file2Content.split('\n')
      const headers = parseCsvRow(rows[0])
      const keyIndex = headers.indexOf(file2Key)

      if (keyIndex === -1) {
        reject(new Error(`Key "${file2Key}" not found in file2`))
        return
      }

      if (!headersWritten) {
        writeStream.write(`${headers.join(',')}\n`)
        headersWritten = true
      }

      rows
        .slice(1)
        .map((row) => parseCsvRow(row))
        .filter((values) => lookup.has(values[keyIndex]))
        .forEach((values) => {
          writeStream.write(
            `${values
              .map((value) => {
                if (/[,"\n]/.test(value)) {
                  return `"${value.replace(/"/g, '""')}"`
                }
                return value
              })
              .join(',')}\n`,
          )
        })

      writeStream.end()
      resolve()
    })
    file2Stream.on('error', reject)
  })

  return {
    success: true,
    body: {
      message: 'Processing successful',
      filePath: outputPath,
      fileName: `${outputPrefix}_${outputFileName}`,
    },
  }
}
