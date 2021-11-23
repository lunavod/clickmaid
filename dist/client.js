"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dumpSchema = exports.runQuery = void 0;
const chalk = require("chalk");
const clickhouse_1 = require("clickhouse");
const path = require("path");
const config_1 = require("./config");
const logger_1 = require("./logger");
const fs = require("fs-extra");
const luxon_1 = require("luxon");
let connection;
const start = async () => {
    if (connection)
        return connection;
    const connectionConfig = { database: config_1.config.database };
    if (config_1.config.username) {
        connectionConfig.basicAuth = { username: config_1.config.username, password: config_1.config.password };
    }
    try {
        const c = new clickhouse_1.ClickHouse({ config: connectionConfig });
        await c.query('SELECT 1').toPromise();
    }
    catch (err) {
        const c = new clickhouse_1.ClickHouse({ config: Object.assign(Object.assign({}, connectionConfig), { database: undefined }) });
        await c.query(`CREATE DATABASE ${config_1.config.database}`).toPromise();
    }
    const clickhouse = new clickhouse_1.ClickHouse({ config: connectionConfig });
    connection = clickhouse;
    return connection;
};
const runQuery = async (query) => {
    const clickhouse = await start();
    (0, logger_1.debug)(chalk.blue(query));
    return clickhouse.query(query).toPromise();
};
exports.runQuery = runQuery;
const getSchema = async () => {
    let schema = `/* Generated ${luxon_1.DateTime.now().toFormat('HH:mm dd.MM.yyyy')} */`;
    const tables = (await (0, exports.runQuery)('SHOW TABLES')).map((record) => record.name);
    for (const table of tables) {
        const r = await (0, exports.runQuery)(`SHOW CREATE TABLE ${table}`);
        schema += '\n\n' + r[0].statement.replace(`TABLE ${config_1.config.database}.`, 'TABLE IF NOT EXISTS ') + ';';
    }
    return schema;
};
const dumpSchema = async () => {
    (0, logger_1.info)('Dumping schema...');
    const schema = await getSchema();
    const schemaFilePath = path.resolve(process.cwd(), config_1.config.baseDir, config_1.config.schemaFile);
    await fs.writeFile(schemaFilePath, schema);
    (0, logger_1.info)('Done');
};
exports.dumpSchema = dumpSchema;
//# sourceMappingURL=client.js.map