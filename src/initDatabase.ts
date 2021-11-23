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
  const queries = await fs.readFile(schemaFilePath, 'utf8')
  console.log(await runQuery<any>(queries))
}
