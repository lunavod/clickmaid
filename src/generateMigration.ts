import * as path from 'path'
import { config } from './config'
import { error } from './logger'
import * as fs from 'fs-extra'
import * as inquirer from 'inquirer'
import { info } from 'console'

export const generateMigration = async (name: string) => {
  if (!name) {
    const answer = await inquirer.prompt({ type: 'input', name: 'name', message: 'Migration name' })
    name = answer.name
  }
  name = name.replace(/\s/g, '_')
  const migrationsFolder = path.join(process.cwd(), config.baseDir, config.migrationsDir)
  if (!(await fs.pathExists(migrationsFolder))) {
    error(`Migrations dir not found (${migrationsFolder})`)
    return
  }

  const fullName = `${new Date().getTime()}-${name}.sql`

  await fs.writeFile(path.join(migrationsFolder, fullName), '/* Replace this comment with some cool SQL */')

  info(path.join(migrationsFolder, fullName))
}
