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
        var productData = {
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            farm: req.body.farm,
            status: 'In Progress',
            category: req.body.category,
            smartContract: req.body.smartContract,
            steps: req.body.steps,
            lots: req.body.lots,
        }
        var product = await repo.createProduct(productData).catch(err => {res.status(400).send(err)})
        res.status(status.OK).json(product)
    })

    router.get('/:productID', async (req,res) => {
        var product = await repo.getProduct(req.params.productID).catch(err => {res.status(400).send(err)})
        res.status(status.OK).json(product)
    })
    router.put('/:productID', async (req,res) => {
        var productData = {
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            farm: req.body.farm,
            status: 'In Progress',
            category: req.body.category,
            smartContract: req.body.smartContract,
            steps: req.body.steps,
            extras: req.body.extras,
            dealers:req.body.dealers,
            media: req.body.media,
            lots: req.body.lots,
        }
        var product = await repo.updateProduct(req.params.productID,productData).catch(err => {res.status(400).send(err)})
        res.status(status.OK).json(product)
    })
    router.delete('/:productID', async (req,res) => {
        var product = await repo.deleteProduct(req.params.productID).catch(err => {res.status(400).send(err)})
        res.status(status.OK).send()
    })

    return router;
}