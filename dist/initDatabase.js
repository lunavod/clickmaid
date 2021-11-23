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
    const queries = await fs.readFile(schemaFilePath, 'utf8');
    console.log(await (0, client_1.runQuery)(queries));
};
exports.initDatabase = initDatabase;
//# sourceMappingURL=initDatabase.js.map