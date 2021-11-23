import * as chalk from 'chalk'
import { DateTime } from 'luxon'

const levels = ['debug', 'info', 'warn', 'error']
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const log = (level: LogLevel, ...args) => {
  const date = DateTime.now().toFormat('dd.MM HH:mm:ss')
  console.log(chalk.grey(`[${date}]`), ...args)
}

export const debug = (...args) => log('debug', ...args)
export const info = (...args) => log('info', ...args)
export const warn = (...args) => log('warn', ...args)
export const error = (...args) => log('error', ...args)
