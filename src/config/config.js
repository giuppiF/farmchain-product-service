const dbSettings = {
    db: process.env.DB_NAME,
    server: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}

const serverSettings = {
    port: process.env.SERVER_PORT || 4000,
}

const farmServiceSettings = {
    host: process.env.FARM_SERVER_HOST,
    port: process.env.FARM_SERVER_PORT
}

const uploadServiceSettings = {
    path: process.env.STORAGE_PATH
}

//settings blockchain API
const bcServiceSettings = {
    host: process.env.BC_SERVER_HOST,
    port: process.env.BC_SERVER_PORT
}

const constants = {
    step: {
        status: {
            current: "Current",
            next: "Next",
            completed: "Completed"
        }
    },
    product: {
        status: {
            inprog: "In Progress",
            completed: "Completed"
        },
        labelUrl: 'https://api.farmchain.it/product/types/label/build/?id='
    }
}
const host = 'http://product:' + serverSettings.port

const kafkaSettings = {
    server:  'ec2-52-211-239-111.eu-west-1.compute.amazonaws.com:9092',
  };


const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      components: {},
      info: {
        title: 'Product service API',
        version: '1.0.0',
        description: 'Microservice PRODUCT api documentation',
      },
    },
    host: host,
    basePath: '/product',
    // List of files to be processes. You can also set globs './routes/*.js'
    apis: ['src/**/*.js'],
  };  


const authSettings = {
    JWTSecret: process.env.JWT_SECRET
}

const awsSettings = {
    s3BucketName:  process.env.AWS_S3_BUCKET_NAME,
  }

module.exports = Object.assign({}, { dbSettings, serverSettings,farmServiceSettings, bcServiceSettings, uploadServiceSettings, constants, authSettings,swaggerOptions,kafkaSettings,awsSettings})
