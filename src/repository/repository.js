'use strict'
const Product = require('../models/product.model')
const ProductType = require('../models/productType.model')
const Media = require('../models/media.model')

const repository = () => {
    
  const getAllProducts = async () => {
    try {
      let products = await Product.find();
      return products
    } catch (error) {
      throw Error(error);
    }
  }

  const getProduct = async (id) =>
  {
    try {
      let product = await Product.findById(id)
      return product
    } catch (error){
      throw Error(error);
    }
  }

  const createProduct = async (payload) => {
    try{
      let product = await new Product(payload)
      await product.save()   
      return product
    } catch (error) {
      throw Error(error)
    }
  }

  const updateProduct = async (id, productBody) => {
    try{
      let product = await Product.findByIdAndUpdate(id,productBody,{new: true,runValidators: true})
      return product
    } catch (error) {
      throw Error(error)
    }
  }

  const deleteProduct = async (id) => {
    try{
      let product = await Product.findByIdAndRemove(id)
      return product
    } catch (error) {
      throw Error(error)
    }
  }

  const updateLots = async (id, productBody) => {
    try{
      console.log(productBody)
      let product = await Product.findByIdAndUpdate(id,productBody,{new: true,runValidators: true})
      return product
    } catch (error) {
      throw Error(error)
    }
  }

  const updateLot= async (productId, lotId, lotData) => {
    try {
      let product = await Product.findOneAndUpdate(
        {_id: productId, "lots._id" : lotId}, 
        { "lots.$" : lotData }, 
        { new: true,runValidators: true })

      return product
    } catch (error){
      throw Error(error)
    }
  }

  const deleteLot = async (productId, lotId) => {
    try{
      let product = await Product.findOneAndUpdate(
        {_id: productId, "lots._id" : lotId},
        {$pull: {lots: {_id: lotId }}},
        { new: true,runValidators: true })
      return product
    } catch (error){
      throw Error(error)
    }
  }

  const updateDealers = async (id, productBody) => {
    try{
      let product = await Product.findByIdAndUpdate(id,productBody,{new: true,runValidators: true})
      return product
    } catch (error) {
      throw Error(error)
    }
  }

  const updateDealer= async (productId, dealerId, dealerData) => {
    try {
      let product = await Product.findOneAndUpdate(
        {_id: productId, "dealers._id" : dealerId}, 
        { "dealers.$" : dealerData }, 
        { new: true,runValidators: true })

      return product
    } catch (error){
      throw Error(error)
    }
  }

  const deleteDealer = async (productId, dealerId) => {
    try{
      let product = await Product.findOneAndUpdate(
        {_id: productId, "dealers._id" : dealerId},
        {$pull: {dealers: {_id: dealerId }}},
        { new: true,runValidators: true })
      return product
    } catch (error){
      throw Error(error)
    }
  }

  const getProductTypes = async () => {
    try {
      let productTypes = await ProductType.find();
      return productTypes
    } catch (error) {
      throw Error(error);
    }
  }
  const createProductType = async (payload) => {
    try{
      let productType = await new ProductType(payload)
      await productType.save()   
      return productType
    } catch (error) {
      throw Error(error)
    }
  }
  const updateProductType = async (id, productTypeBody) => {
    try{
      let productType = await ProductType.findByIdAndUpdate(id,productTypeBody,{new: true,runValidators: true})
      return productType
    } catch (error) {
      throw Error(error)
    }
  }
  
  const deleteProductType = async (id) => {
    try{
      let productType = await ProductType.findByIdAndRemove(id)
      return productType
    } catch (error) {
      throw Error(error)
    }
  }

  const createMedia = async (payload) => {
    try{
      let media = await new Media(payload)
      await media.save()   
      return media
    } catch (error) {
      throw Error(error)
    }
  }
    
  const updateMedia = async (id, mediaBody) => {
    try{
      let media = await Media.findByIdAndUpdate(id,mediaBody,{new: true,runValidators: true})
      return media
    } catch (error) {
      throw Error(error)
    }
  }

  const addMediasToProduct = async (productId, medias) => {
    try{
      let product = Product.findByIdAndUpdate(
         productId ,
        { $addToSet: { media: { $each: medias } } },
        {new: true,runValidators: true}
      );
      
      return product
    } catch (error) {
      throw Error(error)
    }
  }

  const updateProductMedia = async (productId, productBody) => {
    try{
      let product = await Product.findByIdAndUpdate(productId,productBody,{new: true,runValidators: true})
      return product
    } catch (error) {
      throw Error(error)
    }
  }

  const addStep = async (prodcutId, step) => {
    try{
      let product = await Product.findByIdAndUpdate(prodcutId,{ $push: { steps: step }},{new: true,runValidators: true})
      return product
    } catch (error) {
      throw Error(error)
    }
  }

  const updateSteps = async (id, productBody) => {
    try{
      let product = await Product.findByIdAndUpdate(id,productBody,{new: true,runValidators: true})
      return product
    } catch (error) {
      throw Error(error)
    }
  }

  const updateStep= async (productId, stepId, stepData) => {
    try {
      let product = await Product.findOneAndUpdate(
        {_id: productId, "steps._id" : stepId}, 
        { "steps.$" : stepData }, 
        { new: true,runValidators: true })

      return product
    } catch (error){
      throw Error(error)
    }
  }

  const deleteStep = async (productId, stepId) => {
    try{
      let product = await Product.findOneAndUpdate(
        {_id: productId, "steps._id" : stepId},
        {$pull: {steps: {_id: stepId }}},
        { new: true,runValidators: true })
      return product
    } catch (error){
      throw Error(error)
    }
  }



  return Object.create({
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateLots,
    updateLot,
    deleteLot,
    updateDealers,
    updateDealer,
    deleteDealer,
    getProductTypes,
    createProductType,
    updateProductType,
    deleteProductType,
    createMedia,
    updateMedia,
    addMediasToProduct,
    updateProductMedia,
    addStep,
    updateStep,
    updateSteps,
    deleteStep
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