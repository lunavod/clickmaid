#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const runMigrations_1 = require("./runMigrations");
const commander_1 = require("commander");
const generateMigration_1 = require("./generateMigration");
const initDatabase_1 = require("./initDatabase");
const program = new commander_1.Command();
program.command('migrations:run').action(() => (0, runMigrations_1.runMigrations)());
program.command('migrations:generate [name]').action((name) => (0, generateMigration_1.generateMigration)(name));
program.command('schema:load').action(initDatabase_1.initDatabase);
program.parse(process.argv);
//# sourceMappingURL=index.js.map