const path = require('path')
const Postgrator = require('postgrator')
const getConfig = require('./config')

function getPostgratorInstance(config) {
  return new Postgrator({
    migrationDirectory: path.join(__dirname, '../migrations'),
    driver: 'pg',
    host: config.pgPlugin.write,
    port: config.pgPlugin.config.port,
    database: config.pgPlugin.config.database,
    username: config.pgPlugin.config.user,
    password: config.pgPlugin.config.password,
    ssl: config.pgPlugin.config.ssl,
    schemaTable: 'migrations',
    currentSchema: 'public'
  })
}

async function migrateSchema() {
  try {
    const config = await getConfig()
    const postgrator = getPostgratorInstance(config)
    const result = await postgrator.migrate()

    if (result.length === 0) {
      console.log(
        'No migrations run for schema "public". Already at the latest one.'
      )
    }

    console.log('Migration done')
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

if (require.main === module) {
  migrateSchema()
}

module.exports = { getPostgratorInstance, migrateSchema }
