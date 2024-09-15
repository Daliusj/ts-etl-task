import { unlink } from 'fs/promises'

export const processRow = (row: Record<string, string>) => {
  if (!row) return null
  const headerUpperCase = row.header.toUpperCase()
  return {
    HEADER: headerUpperCase,
  }
}
export const formCsvContent = (lineCount: number) => {
  const header = 'header\n'
  const originalRows = 'test\n'.repeat(lineCount)
  const expectedRows = 'TEST\n'.repeat(lineCount)
  const original = header + originalRows
  const expected = header.toUpperCase() + expectedRows

  return { original, expected }
}

export const deleteFiles = (() => {
  const isFileNotFoundError = (error: unknown): boolean =>
    error instanceof Error && 'code' in error && error.code === 'ENOENT'

  const unlinkIfExists = async (path: string) => {
    try {
      return await unlink(path)
    } catch (error) {
      if (isFileNotFoundError(error)) return undefined
      throw error
    }
  }

  return (...paths: string[]) =>
    async () => {
      await Promise.all(paths.map(unlinkIfExists))
    }
})()
