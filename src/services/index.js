const farmService = require('./farm.service')
const blockchainService = require('./blockchain.service')
const storageService = require('./storage.service')
const advService = require('./adv.service')

module.exports = Object.assign({}, {farmService,blockchainService,storageService,advService})
