import * as path from 'path'
import * as fs from 'fs-extra'

let cfg = {
  username: undefined,
  password: undefined,
  database: undefined,
  baseDir: 'clickhouse',
  schemaFile: 'schema.sql',
  migrationsDir: 'migrations',
  migrationsTable: 'migrations_maid',
  logLevel: 'info',
}

if (fs.pathExistsSync(path.join(process.cwd(), 'ch_maid.js'))) {
  cfg = { ...cfg, ...require(path.join(process.cwd(), 'ch_maid.js')) }
}

export const config = cfg
