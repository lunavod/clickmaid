"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const path = require("path");
const fs = require("fs-extra");
let cfg = {
    username: undefined,
    password: undefined,
    database: undefined,
    baseDir: 'clickhouse',
    schemaFile: 'schema.sql',
    migrationsDir: 'migrations',
    migrationsTable: 'migrations_maid',
    logLevel: 'info',
};
if (fs.pathExistsSync(path.join(process.cwd(), 'ch_maid.js'))) {
    cfg = Object.assign(Object.assign({}, cfg), require(path.join(process.cwd(), 'ch_maid.js')));
}
exports.config = cfg;
//# sourceMappingURL=config.js.map