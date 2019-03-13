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
  
module.exports = Object.assign({}, { dbSettings, serverSettings,farmServiceSettings, bcServiceSettings, uploadServiceSettings, constants})
