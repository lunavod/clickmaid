#!/usr/bin/env node

require('dotenv').config()

import { runMigrations } from './runMigrations'

import { Command } from 'commander'
import { generateMigration } from './generateMigration'
import { initDatabase } from './initDatabase'

const program = new Command()

program.command('migrations:run').action(() => runMigrations())
program.command('migrations:generate [name]').action((name) => generateMigration(name))
program.command('schema:load').action(initDatabase)

program.parse(process.argv)
