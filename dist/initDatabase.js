"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = void 0;
const path = require("path");
const fs = require("fs-extra");
const client_1 = require("./client");
const config_1 = require("./config");
const logger_1 = require("./logger");
const initDatabase = async () => {
    const schemaFilePath = path.resolve(process.cwd(), config_1.config.baseDir, config_1.config.schemaFile);
    if (!(await fs.pathExists(schemaFilePath))) {
        (0, logger_1.error)(`Schema not found in ${schemaFilePath}`);
        return;
    }
    const raw = await fs.readFile(schemaFilePath, 'utf8');
    const queries = raw
        .slice(raw.indexOf('CREATE TABLE IF NOT EXISTS'), raw.length)
        .split('CREATE TABLE IF NOT EXISTS')
        .filter((i) => i.length)
        .map((s) => 'CREATE TABLE IF NOT EXISTS' + s);
    for (const query of queries) {
        await (0, client_1.runQuery)(query);
    }
};
exports.initDatabase = initDatabase;
//# sourceMappingURL=initDatabase.js.map