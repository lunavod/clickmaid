import * as path from 'path'
import * as fs from 'fs-extra'
import { runQuery } from './client'
import { config } from './config'
import { error } from './logger'

export const initDatabase = async () => {
  const schemaFilePath = path.resolve(process.cwd(), config.baseDir, config.schemaFile)
  if (!(await fs.pathExists(schemaFilePath))) {
    error(`Schema not found in ${schemaFilePath}`)
    return
  }
  const raw = await fs.readFile(schemaFilePath, 'utf8')

  const queries = raw
    .slice(raw.indexOf('CREATE TABLE IF NOT EXISTS'), raw.length)
    .split('CREATE TABLE IF NOT EXISTS')
    .filter((i) => i.length)
    .map((s) => 'CREATE TABLE IF NOT EXISTS' + s)

  for (const query of queries) {
    await runQuery<any>(query)
  }
}
