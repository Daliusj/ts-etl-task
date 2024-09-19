import { unlink } from 'fs/promises'

// eslint-disable-next-line import/prefer-default-export
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
