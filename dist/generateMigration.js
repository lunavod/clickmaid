"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMigration = void 0;
const path = require("path");
const config_1 = require("./config");
const logger_1 = require("./logger");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const console_1 = require("console");
const generateMigration = async (name) => {
    if (!name) {
        const answer = await inquirer.prompt({ type: 'input', name: 'name', message: 'Migration name' });
        name = answer.name;
    }
    name = name.replace(/\s/g, '_');
    const migrationsFolder = path.join(process.cwd(), config_1.config.baseDir, config_1.config.migrationsDir);
    if (!(await fs.pathExists(migrationsFolder))) {
        (0, logger_1.error)(`Migrations dir not found (${migrationsFolder})`);
        return;
    }
    const fullName = `${new Date().getTime()}-${name}.sql`;
    await fs.writeFile(path.join(migrationsFolder, fullName), '/* Replace this comment with some cool SQL */');
    (0, console_1.info)(path.join(migrationsFolder, fullName));
};
exports.generateMigration = generateMigration;
//# sourceMappingURL=generateMigration.js.map