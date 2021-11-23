"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = void 0;
const console_1 = require("console");
const path = require("path");
const client_1 = require("./client");
const config_1 = require("./config");
const fs = require("fs-extra");
const runMigrations = async () => {
    const tables = (await (0, client_1.runQuery)('SHOW TABLES')).map((record) => record.name);
    if (!tables.includes(config_1.config.migrationsTable)) {
        (0, console_1.warn)(`Migrations table (${config_1.config.migrationsTable}) not found, creating`);
        await (0, client_1.runQuery)(`CREATE TABLE ${config_1.config.migrationsTable} (\`Time\` DateTime, \`Name\` String) ENGINE = TinyLog`);
    }
    const doneMigrations = (await (0, client_1.runQuery)(`SELECT Name FROM ${config_1.config.migrationsTable}`)).map((r) => r.Name);
    const migrationsFolder = path.join(process.cwd(), config_1.config.baseDir, config_1.config.migrationsDir);
    if (!(await fs.pathExists(migrationsFolder))) {
        (0, console_1.error)(`Migrations dir not found (${migrationsFolder})`);
        return;
    }
    const newMigrationFiles = (await fs.readdir(migrationsFolder)).filter((f) => f.endsWith('.sql') && !doneMigrations.includes(f));
    newMigrationFiles.sort((a, b) => a.localeCompare(b));
    if (!newMigrationFiles.length) {
        (0, console_1.info)('Nothing new, exiting');
        return;
    }
    (0, console_1.info)(`Found new migrations: ${newMigrationFiles.map((f) => f.replace('.sql', '')).join(', ')}`);
    for (const name of newMigrationFiles) {
        const query = await fs.readFile(path.join(migrationsFolder, name), 'utf8');
        (0, console_1.info)(`Executing ${name}`);
        (0, console_1.debug)(await (0, client_1.runQuery)(query));
        (0, client_1.runQuery)(`INSERT INTO ${config_1.config.migrationsTable}  (Name, Time) VALUES ('${name}', NOW())`);
    }
    await (0, client_1.dumpSchema)();
};
exports.runMigrations = runMigrations;
//# sourceMappingURL=runMigrations.js.map