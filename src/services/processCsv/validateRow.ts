import { ZodSchema } from 'zod'

export default function createRowValidator<T>(schema: ZodSchema) {
  return (csvObject: T): T | null => {
    const result = schema.safeParse(csvObject)
    if (result.success) return csvObject
    return null
  }
}
