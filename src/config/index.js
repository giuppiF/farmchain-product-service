const {dbSettings, serverSettings,farmServiceSettings,bcServiceSettings, uploadServiceSettings, constants} = require('./config')
const db = require('./mongo')

module.exports = Object.assign({}, {dbSettings, serverSettings, farmServiceSettings,bcServiceSettings, db, uploadServiceSettings, constants})