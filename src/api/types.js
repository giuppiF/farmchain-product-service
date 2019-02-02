'use strict'
const status = require('http-status')
const router = require('express').Router();


module.exports = (options) => {
    const {repo} = options
    

    router.get('/', async (req,res) => {
        var productTypes = await repo.getProductTypes();
        res.status(status.OK).json(productTypes)
    })

    router.post('/', async (req,res) => {
        const productTypeData = {
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            steps: req.body.steps,
        }

        try{
            var productType = await repo.createProductType(productTypeData)
            productType ?
                res.status(status.OK).json(productType)
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })

    router.put('/:productTypeID', async (req,res) => {
        const productTypeData = {
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            steps: req.body.steps,
        }

        try{
            var productType = await repo.updateProductType(req.params.productTypeID,productTypeData)
            productType ?
                res.status(status.OK).json(productType)
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })
    router.delete('/:productTypeID', async (req,res) => {
        try{
            var productType = await repo.deleteProductType(req.params.productTypeID)
            productType ?
                res.status(status.OK).json(productType)             
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })

   
    return router;
}