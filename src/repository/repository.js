'use strict'
const Product = require('../models/product.model')

const repository = () => {
    
  const getAllProducts = () => {
    return new Promise((resolve, reject) => {
      let products = Product.find();
      resolve(products);
    })
  }

  const getProduct = (id) => {
    return new Promise((resolve,reject) =>{
      let product = Product.findById(id);
      if(!product) reject()
      resolve(product)
    })
  }
  const createProduct = (payload) => {
    return new Promise((resolve, reject) => {
      let product = new Product(payload)
      product.save((err,data) => {
        console.log(err)
        if(err) reject(err)
        resolve(data)
      })
    })
  }

  const updateProduct = (id, productBody) => {
    return new Promise((resolve,reject) =>{
      let product = Product.findByIdAndUpdate(id,productBody,{new: true});
      if(!product) reject()
      resolve(product)
    })
  }

  const deleteProduct = (id) => {
    return new Promise((resolve,reject) =>{
      let product = Product.findByIdAndRemove(id);
      if(!product) reject()
      resolve(product)
    })
  }

  return Object.create({
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
  })
}

const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('connection db not supplied!'))
    }
    
    resolve(repository(connection))
  })
}

module.exports = Object.assign({}, {connect})
