export default function parseCsvRow(row: string): string[] {
  return row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((originalField) => {
    let field = originalField.replace(/^"|"$/g, '').replace(/""/g, '"').trim()
    if (field.startsWith('[') && field.endsWith(']')) {
      field = field.slice(1, -1)
      field = field.replace(/'/g, "''")
      return `{${field}}`
    }
    return field
  })
}
