const {dbSettings, serverSettings,farmServiceSettings,bcServiceSettings} = require('./config')
const db = require('./mongo')

module.exports = Object.assign({}, {dbSettings, serverSettings, farmServiceSettings,bcServiceSettings, db})