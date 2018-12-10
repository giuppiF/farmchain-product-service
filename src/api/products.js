'use strict'
const status = require('http-status')
const router = require('express').Router();


module.exports = (options) => {
    const {repo, farmService, blockchainService} = options
    
    router.get('/', async (req,res) => {
        var products = await repo.getAllProducts();
        res.status(status.OK).json(products)
    })

    router.get('/types', async (req,res) => {
        var productTypes = await repo.getProductTypes();
        res.status(status.OK).json(productTypes)
    })

    router.post('/types', async (req,res) => {
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

    router.put('/types/:productTypeID', async (req,res) => {
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
    router.delete('/types/:productTypeID', async (req,res) => {
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
            steps: req.body.steps,
            lots: req.body.lots,
        }

        try{
            var product = await repo.createProduct(productData)
        } catch (err) {
            res.status(400).send({'msg': err.message})
            return
        }
        
        var lightProductData= {
            _id: product._id,
            name: product.name,
            image: product.image,
            category: product.category,
            updatedAt: product.updatedAt,
            status: product.status
        }

        try{
            var smartContract = await blockchainService.createProductSmartContract()
            if(smartContract){
                product.smartContract = smartContract;
                product.save()
            }
            else
            {
                res.status(404).send()
                product.remove()
            }
            var farm = await farmService.addProductToFarm(product.farm,lightProductData)
            if(farm)
                res.status(status.OK).json(product._id)
            else
            {
                res.status(404).send()
                product.remove()
            }

        } catch (err) {
            res.status(400).send({'msg': err.message})
            product.remove()
        }
    })

    router.get('/:productID', async (req,res) => {
        try{
            var product = await repo.getProduct(req.params.productID)
            product ?
                res.status(status.OK).json(product)
            :
                res.status(404).send()  
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })

    router.put('/:productID', async (req,res) => {
        var productData = {
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            farm: req.body.farm,
            status: req.body.status,
            category: req.body.category,
            smartContract: req.body.smartContract,
            steps: req.body.steps,
            extras: req.body.extras,
            dealers:req.body.dealers,
            media: req.body.media,
            lots: req.body.lots,
        }

        var farmProductData= {
            _id: req.params.productID,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            updatedAt: Date.now(),
            status: req.body.status,
        }

        try{
            var farm = await farmService.updateProductToFarm(req.body.farm,farmProductData)
            if(!farm){
                res.status(404).send()
                return;
            }
            var product = await repo.updateProduct(req.params.productID,productData)
            product ?
                res.status(status.OK).json(product)
            :
                res.status(404).send()
         } catch (err) {
            res.status(400).send({'msg': err.message})
        }

    })
    router.delete('/:productID', async (req,res) => {
        try{
            var product = await repo.deleteProduct(req.params.productID)
            if(!product){
                res.status(404).send()
                return
            }
            var farm = await farmService.deleteProductToFarm(product.farm,product._id)
            farm ?
                res.status(status.OK).json(product)             
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })


    


    return router;
}