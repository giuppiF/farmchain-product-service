const {dbSettings, serverSettings,farmServiceSettings,bcServiceSettings, uploadServiceSettings, constants, authSettings,swaggerOptions,kafkaSettings,awsSettings} = require('./config')
const db = require('./mongo')
const authConfig = require('./auth')

module.exports = Object.assign({}, {dbSettings, serverSettings, farmServiceSettings,bcServiceSettings, db, uploadServiceSettings, constants, authSettings, authConfig,swaggerOptions,kafkaSettings,awsSettings})