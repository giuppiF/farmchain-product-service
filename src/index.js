'use strict'
const {EventEmitter} = require('events')
const server = require('./server/server')
const repository = require('./repository/repository')
const config = require('./config')
const mediator = new EventEmitter()
const services = require('./services/')

mediator.on('db.ready', async (db) => {
    var repo = await repository.connect(db);

    var farmService = await services.farmService.start({
        host: config.farmServiceSettings.host,
        port: config.farmServiceSettings.port
    })
 
    var blockhainService = await services.blockchainService.start({
        host: config.bcServiceSettings.host,
        port: config.bcServiceSettings.port
    })

    var storageService = await services.storageService.start({
        path: config.uploadServiceSettings.path
    })

    var advService = await services.advService.start({
        storagePath: config.uploadServiceSettings.path
    })

    var auth = await config.authConfig.start({
        secret: config.authSettings.JWTSecret,
        repo: repo
    })

    var app = await server.start({
        port:  config.serverSettings.port,
        repo: repo,
        farmService:  farmService,
        blockchainService: blockhainService,
        storagePath: config.uploadServiceSettings.path,
        storageService: storageService,
        advService: advService,
        constants: config.constants,
        auth: auth,
        swaggerOptions: config.swaggerOptions

    })

    app.on('close', () => {
        repo.disconnect()
    })
})

mediator.on('db.error', () => {
    console.error('Errore nello start del db')
  })


config.db.connect(config.dbSettings, mediator)


mediator.emit('boot.ready');