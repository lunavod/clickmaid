module.exports = {
  database: process.env.DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  baseDir: 'example',
  schemaFile: 'schema.sql',
  migrationsDir: 'migrations',
  migrationsTable: 'migrations_maid',
  logLevel: 'debug',
}
