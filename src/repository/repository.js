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

  /*const updateLots = async (id, productBody) => {
    try{
      let product = await Product.findByIdAndUpdate(id,productBody,{new: true,runValidators: true})
      return product
    } catch (error) {
      throw Error(error)
    }
  }*/

  const updateLot= async ( lotId, lotData) => {
    try {
      let product = await Product.updateMany(
        {"lots._id" : lotId}, 
        { "lots.$" : lotData })

      return product
    } catch (error){
      throw Error(error)
    }
  }
  const updateProductLot= async (productId, lotId, lotData) => {
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

  const deleteLot = async ( lotId) => {
    try{
      let product = await Product.updateMany(
        {"lots._id" : lotId},
        {$pull: {lots: {_id: lotId }}})
      return product
    } catch (error){
      throw Error(error)
    }
  }
  const deleteProductLot = async (productId, lotId) => {
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

  const updateDealer= async ( dealerId, dealerData) => {
    try {
      let product = await Product.updateMany(
        { "dealers._id" : dealerId}, 
        { "dealers.$" : dealerData })

      return product
    } catch (error){
      throw Error(error)
    }
  }
  const updateProductDealer= async (productId, dealerId, dealerData) => {
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

  const deleteDealer = async (dealerId) => {
    try{
      let product = await Product.updateMany(
        { "dealers._id" : dealerId},
        {$pull: {dealers: {_id: dealerId }}})
      return product
    } catch (error){
      throw Error(error)
    }
  }
  const deleteProductDealer = async (productId, dealerId) => {
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

  const getProductType = async (id) => {
    try {
      let productType = await ProductType.findById(id);
      return productType
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
  const getMedia = async (id) =>
  {
    try {
      let media = await Media.findById(id)
      return media
    } catch (error){
      throw Error(error);
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

  /*const updateProductMedia = async (productId, productBody) => {
    try{
      let product = await Product.findByIdAndUpdate(productId,productBody,{new: true,runValidators: true})
      return product
    } catch (error) {
      throw Error(error)
    }
  }*/

  const addStep = async (productId, step) => {
    try{
      let product = await Product.findByIdAndUpdate(productId,{ $push: { steps: step }},{new: true,runValidators: true})
      return product
    } catch (error) {
      throw Error(error)
    }
  }
  const getStep = async (productId,stepId) =>
  {
    try {
      let product = await Product.findById(productId)
      return product.steps.id(stepId)
    } catch (error){
      throw Error(error);
    }
  }


  /*const updateSteps = async (id, productBody) => {
    try{
      let product = await Product.findByIdAndUpdate(id,productBody,{new: true,runValidators: true})
      return product
    } catch (error) {
      throw Error(error)
    }
  }*/

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

  const updateStatusStep = async (productId, stepId, stepData) => {
    try {
      let product = await Product.findOneAndUpdate(
        {_id: productId, "steps._id" : stepId}, 
        { "steps.$.status" : stepData.status }, 
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

  /*const updateFarm = async (id, productBody) => {
    try{
      let product = await Product.findByIdAndUpdate(id,productBody,{new: true,runValidators: true})
      return product
    } catch (error) {
      throw Error(error)
    }
  }*/

  /*const updateProductRawProducts = async (productId, productBody) => {
    try{
      let product = await Product.findByIdAndUpdate(productId,productBody,{new: true,runValidators: true})
      return product
    } catch (error) {
      throw Error(error)
    }
  }*/

  const getExtra = async (productId,extraId) =>
  {
    try {
      let product = await Product.findById(productId)
      return product.extras.id(extraId)
    } catch (error){
      throw Error(error);
    }
  }

  const addExtra = async (productId, extra) => {
    try{
      let product = await Product.findByIdAndUpdate(productId,{ $push: { extras: extra }},{new: true,runValidators: true})
      let product_udpated = await Product.findById(productId)
      let position = product_udpated.extras.length - 1
      return product_udpated.extras[position]
    } catch (error) {
      throw Error(error)
    }
  }

  const updateExtra= async (productId, extraId, extraData) => {
    try {
      let product = await Product.findOneAndUpdate(
        {_id: productId, "extras._id" : extraId}, 
        { "extras.$" : extraData }, 
        { new: true,runValidators: true })

      return product
    } catch (error){
      throw Error(error)
    }
  }

  const deleteExtra = async (productId, extraId) => {
    try{
      let product = await Product.findOneAndUpdate(
        {_id: productId, "extras._id" : extraId},
        {$pull: {extras: {_id: extraId }}},
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
    updateLot,
    updateProductLot,
    deleteLot,
    deleteProductLot,
    updateDealer,
    updateProductDealer,
    deleteDealer,
    deleteProductDealer,
    getProductTypes,
    getProductType,
    createProductType,
    updateProductType,
    deleteProductType,
    createMedia,
    updateMedia,
    getMedia,
    addMediasToProduct,
    addStep,
    getStep,
    updateStep,
    updateStatusStep,
    deleteStep,
    getExtra,
    addExtra,
    updateExtra,
    deleteExtra

    //updateLots,
    //updateProductMedia,
    //updateProductRawProducts,
    //updateSteps,
    //updateFarm,
    //updateDealers,
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
