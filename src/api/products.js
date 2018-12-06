'use strict'
const status = require('http-status')
const router = require('express').Router();


module.exports = (options) => {
    const {repo} = options
    router.get('/', async (req,res) => {
        var products = await repo.getAllProducts();
        res.status(status.OK).json(products)
    })

    router.post('/', async (req,res) => {
        var product = await repo.createProduct(req.body).catch(err => {res.status(400).send(err)})
        res.status(status.OK).json(product)
    })

    router.get('/:productID', async (req,res) => {
        var product = await repo.getProduct(req.params.productID).catch(err => {res.status(400).send(err)})
        res.status(status.OK).json(product)
    })
    router.put('/:productID', async (req,res) => {
        var product = await repo.updateProduct(req.params.productID,req.body).catch(err => {res.status(400).send(err)})
        res.status(status.OK).json(product)
    })
    router.delete('/:productID', async (req,res) => {
        var product = await repo.deleteProduct(req.params.productID).catch(err => {res.status(400).send(err)})
        res.status(status.OK).send()
    })

    return router;
}