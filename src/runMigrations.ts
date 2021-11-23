import { debug, error, info, warn } from 'console'
import * as path from 'path'
import { dumpSchema, runQuery } from './client'
import { config } from './config'
import * as fs from 'fs-extra'

export const runMigrations = async () => {
  const tables = (await runQuery('SHOW TABLES')).map((record: { name: string }) => record.name)
  if (!tables.includes(config.migrationsTable)) {
    warn(`Migrations table (${config.migrationsTable}) not found, creating`)
    await runQuery(`CREATE TABLE ${config.migrationsTable} (\`Time\` DateTime, \`Name\` String) ENGINE = TinyLog`)
  }

  const doneMigrations = (await runQuery<{ Name: string }>(`SELECT Name FROM ${config.migrationsTable}`)).map(
    (r) => r.Name,
  )

  const migrationsFolder = path.join(process.cwd(), config.baseDir, config.migrationsDir)
  if (!(await fs.pathExists(migrationsFolder))) {
    error(`Migrations dir not found (${migrationsFolder})`)
    return
  }

  const newMigrationFiles = (await fs.readdir(migrationsFolder)).filter(
    (f) => f.endsWith('.sql') && !doneMigrations.includes(f),
  )
  newMigrationFiles.sort((a, b) => a.localeCompare(b))

  if (!newMigrationFiles.length) {
    info('Nothing new, exiting')
    return
  }

  info(`Found new migrations: ${newMigrationFiles.map((f) => f.replace('.sql', '')).join(', ')}`)

  for (const name of newMigrationFiles) {
    const query = await fs.readFile(path.join(migrationsFolder, name), 'utf8')
    info(`Executing ${name}`)
    debug(await runQuery(query))
    runQuery(`INSERT INTO ${config.migrationsTable}  (Name, Time) VALUES ('${name}', NOW())`)
  }

  await dumpSchema()
}
