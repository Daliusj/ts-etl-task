/* eslint-disable import/prefer-default-export */

import config from '../config.ts'
import { createDatabase } from '../database/index.ts'

export const createTestDatabase = () =>
  createDatabase(
    process.env.CI || config.env === 'production'
      ? config.database
      : config.testDatabase,
  )
