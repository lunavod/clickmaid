import * as chalk from 'chalk'
import { ClickHouse } from 'clickhouse'
import * as path from 'path'
import { config } from './config'
import { debug, info } from './logger'
import * as fs from 'fs-extra'
import { DateTime } from 'luxon'

let connection: ClickHouse

const start = async () => {
  if (connection) return connection
  const connectionConfig: Record<string, any> = { database: config.database }
  if (config.username) {
    connectionConfig.basicAuth = { username: config.username, password: config.password }
  }

  try {
    const c = new ClickHouse({ config: connectionConfig })
    await c.query('SELECT 1').toPromise()
  } catch (err) {
    const c = new ClickHouse({ config: { ...connectionConfig, database: undefined } })
    await c.query(`CREATE DATABASE ${config.database}`).toPromise()
  }

  const clickhouse = new ClickHouse({ config: connectionConfig })
  connection = clickhouse
  return connection
}

export const runQuery = async <R>(query: string): Promise<R[]> => {
  const clickhouse = await start()
  debug(chalk.blue(query))
  return clickhouse.query(query).toPromise() as Promise<R[]>
}

const getSchema = async () => {
  let schema = `/* Generated ${DateTime.now().toFormat('HH:mm dd.MM.yyyy')} */`

  const tables = (await runQuery('SHOW TABLES')).map((record: { name: string }) => record.name)

  for (const table of tables) {
    const r = await runQuery<{ statement: string }>(`SHOW CREATE TABLE ${table}`)
    schema += '\n\n' + r[0].statement.replace(`TABLE ${config.database}.`, 'TABLE IF NOT EXISTS ') + ';'
  }

  return schema
}

export const dumpSchema = async () => {
  info('Dumping schema...')
  const schema = await getSchema()
  const schemaFilePath = path.resolve(process.cwd(), config.baseDir, config.schemaFile)
  await fs.writeFile(schemaFilePath, schema)
  info('Done')
}
