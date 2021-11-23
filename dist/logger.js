"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = exports.info = exports.debug = void 0;
const chalk = require("chalk");
const luxon_1 = require("luxon");
const levels = ['debug', 'info', 'warn', 'error'];
const log = (level, ...args) => {
    const date = luxon_1.DateTime.now().toFormat('dd.MM HH:mm:ss');
    console.log(chalk.grey(`[${date}]`), ...args);
};
const debug = (...args) => log('debug', ...args);
exports.debug = debug;
const info = (...args) => log('info', ...args);
exports.info = info;
const warn = (...args) => log('warn', ...args);
exports.warn = warn;
const error = (...args) => log('error', ...args);
exports.error = error;
//# sourceMappingURL=logger.js.map