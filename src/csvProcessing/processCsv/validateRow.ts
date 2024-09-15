import { ZodSchema } from 'zod'

export default function validateRow<T>(schema: ZodSchema) {
  return (csvObject: T): T | null => {
    const result = schema.safeParse(csvObject)
    if (result.success) return csvObject
    return null
  }
}
