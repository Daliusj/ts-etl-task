import { Pool } from 'pg'
import { from as copyFrom } from 'pg-copy-streams'
import { Readable } from 'stream'
import { sql } from 'kysely'
import { Database } from '../database/index.ts'

export function repository(
  db: Database,
  pool: Pool,
  tableName: string,
  columnKeys: string[],
) {
  return {
    async createTempTable() {
      await sql`CREATE TEMPORARY TABLE temp_${sql.raw(tableName)} (LIKE ${sql.raw(tableName)} INCLUDING DEFAULTS)`.execute(
        db,
      )
    },

    async copyStreamToTempTable(stream: Readable) {
      const client = await pool.connect()
      console.log('column keys', `${columnKeys.join(', ')}`)
      try {
        const copyCommand = `COPY temp_${tableName} (${columnKeys.join(', ')}) FROM STDIN WITH CSV HEADER`
        console.log('Executing copy command:', copyCommand)
        const copyStream = client.query(copyFrom(copyCommand))
        console.log('Piping stream to copyStream...')
        stream.pipe(copyStream)
        await new Promise<void>((resolve, reject) => {
          copyStream.on('finish', () => {
            console.log('Copy stream finished successfully.')
            resolve()
          })
          copyStream.on('error', (error) => {
            console.error('Error in copy stream:', error)
            reject(error)
          })
        })
      } catch (error) {
        throw new Error(
          `Copy stream to temporary table error : ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        )
      } finally {
        client.release()
      }
    },

    async copyToProdTable() {
      await sql`
        INSERT INTO ${sql.raw(tableName)}
        SELECT * FROM temp_${sql.raw(tableName)}
      `.execute(db)
    },
  }
}

export type Repository = ReturnType<typeof repository>
