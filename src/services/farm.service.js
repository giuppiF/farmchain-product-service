const axios = require('axios')


const farmService = (options) => {

  const serviceToken = "Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYWlsIjoiY2lyY29sb0BsZXR0b3JpLml0IiwiaWQiOiI1Y2RlYzVkNzJjN2UzZTAwMGY0YTk3OGQiLCJmYXJtIjoiNWMwODFiN2ZiNjc4MTcwMDBlMDc4Y2E5IiwiZXhwIjoxNTYzMjg4MTE1LCJpYXQiOjE1NTgxMDQxMTV9.2ZkA0WqRiHt1RDqBrMPDaux-vjkkpVuXOsHcgJ-QA3o"

    const addProductToFarm = async (farmId,product) => {
        try{
            const url = `http://${options.host}:${options.port}/farm/${farmId}/product`
            let config = {
                headers: {
                  "Content-Type" : "application/json",
                  "Authorization" : serviceToken
                }
              }
            var response = await axios.post(url,product,config)
            return response;
        } catch (err){
            throw  Error(err)
        }
    }

const updateProductToFarm = async (farmId,product) => {
    try{
        const url = `http://${options.host}:${options.port}/farm/${farmId}/product/${product._id}`
        console.log(url)
        let config = {
            headers: {
              "Content-Type" : "application/json",
              "Authorization" : serviceToken
            }
          }
        var response = await axios.put(url,product,config)
        return response;
    } catch (err){
        throw  Error(err)
    }
}

const deleteProductToFarm = async (farmId,productId) => {
    try{
        const url = `http://${options.host}:${options.port}/farm/${farmId}/product/${productId}`
        console.log(url)
        let config = {
            headers: {
              "Content-Type" : "application/json",
              "Authorization" : serviceToken
            }
          }
        var response = await axios.delete(url,config)
        return response;
    } catch (err){
        throw  Error(err)
    }
}

return Object.create({
    addProductToFarm,
    updateProductToFarm,
    deleteProductToFarm
})
}

const start = (options) => {
    return new Promise((resolve, reject) => {

      if (!options) {
        reject(new Error('options settings not supplied!'))
      }

      resolve(farmService(options))
    })
  }

module.exports = Object.assign({}, {start})