const axios = require('axios')


const blockchainService = (options) => {

    const createProductSmartContract = async () => {
        try{
            /*const url = `http://${options.host}:${options.port}/farm/${farmId}/product`
            let config = {
                headers: {
                  "Content-Type" : "application/json",
                }
              }
            var response = await axios.post(url,product,config)*/
            return "smartContractAddress";
        } catch (err){
            throw  Error(err)
        }
    }



return Object.create({
    createProductSmartContract
})
}

const start = (options) => {
    return new Promise((resolve, reject) => {

      if (!options) {
        reject(new Error('options settings not supplied!'))
      }

      resolve(blockchainService(options))
    })
  }

module.exports = Object.assign({}, {start})