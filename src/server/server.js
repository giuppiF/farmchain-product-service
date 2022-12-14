const express = require('express')
const morgan = require('morgan')
const morganBody = require('morgan-body')
const helmet = require('helmet')
const bodyParser = require('body-parser');
const formData = require("express-form-data");
const cors = require('cors')

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const start  = (options) => {
    return new Promise((resolve,reject) =>{
        if(!options.repo){
            reject(new Error('Il repository non è connesso'))
        }
        if(!options.port){
            reject(new Error('Non è disponibile nessuna porta'))
        }

        const app = express()


        // helmet aggiunge header di sicurezza
        app.use(helmet())
        app.use(bodyParser.json()); 
	    app.use(cors())

        // Swagger API docs implementation
        const swaggerSpec = swaggerJsdoc(options.swaggerOptions);
        app.use('/product/api-docs.json', (req,res)=>{
            res.send(swaggerSpec)
        });
        app.use('/product/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        // morgan gestisce il logging sul web server (formati dev, short ... )
        //app.use(morgan(':method :url :status :res[content-length] :res[body] - :response-time ms'))
        
        app.use(formData.parse({
            uploadDir: options.storagePath,
            autoClean: true
        }));
        app.use((err,req,res,next) => {
            reject(new Error('Something went wrong!, err:' + err))
            res.status(500).send('Something went wrong!, err: ' + err)
        })
morganBody(app,{skip:function (req, res) { return res.statusCode < 400 }})
        const productApi = require('../api/products')(options)
        const productTypesApi = require('../api/types')(options)
        const productLotApi = require('../api/lots')(options)
        const productDealersApi = require('../api/dealers')(options)
        const productStepsApi = require('../api/steps')(options)
        const mediaApi = require('../api/media')(options)
        const extraApi = require('../api/extras')(options)
        app.use('/product/media',mediaApi)
        app.use('/product/types',productTypesApi)
        app.use('/product',productApi)
        app.use('/product',productLotApi)
        app.use('/product',productDealersApi)
        app.use('/product',extraApi)
        
        app.use('/product/',productStepsApi)
        


        app.use(express.static(options.storagePath));

        const server = app.listen(options.port, () => resolve(server))
    })
}


module.exports = Object.assign({},{start});
