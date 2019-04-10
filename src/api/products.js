'use strict'
const status = require('http-status')
const router = require('express').Router();
const path = require('path')
const QRCode = require('qrcode')


module.exports = (options) => {
    const {repo, farmService, blockchainService, storageService, storagePath,advService, constants} = options
    
    router.get('/', async (req,res) => {
        var products = await repo.getAllProducts();
        res.status(status.OK).json(products)
    })

    router.post('/', async (req,res) => {
          
        var productData = {
            name: req.body.name,
            description: req.body.description,
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
            if(req.body.image){
                var image = req.body.image
                var parts = image.split('/');
                var filename = Date.now()+ '-' +parts[parts.length - 1]
                var pathname = path.join( req.originalUrl, product._id.toString())
                var completePath = path.join(storagePath,pathname)
                var templateFile =  path.join(storagePath,image)
                var uploadfile = await storageService.copyTemplateFile(templateFile, filename, completePath )
                product.image = path.join(pathname, filename)
                product.save()
            }
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
            var farm = await farmService.addProductToFarm(product.farm._id,lightProductData)
            if(farm)
                res.status(status.OK).json(product)
            else
            {
                res.status(404).send()
                product.remove()
            }

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
            _id: req.params.productID,
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            updatedAt: Date.now(),
            expiration: req.body.expiration
        }
        var farmProductData= {
            _id: req.params.productID,
            name: req.body.name,
            image: req.body.image,
            updatedAt: Date.now()
        }
        try{

            if(req.files.image){
                
                var pathname = req.originalUrl
                var completePathname = path.join(storagePath, pathname)
                var product = await repo.getProduct(req.params.productID)
                if(product.image)
                    var deleteFile = await storageService.deleteFile(product.image,storagePath)            

                var image = req.files.image    
                var filename = Date.now()+ '-' + image.originalFilename
                
                var uploadfile = await storageService.saveToDir(image.path, filename, completePathname )
                productData.image = path.join(pathname,filename)
                farmProductData.image=  path.join(pathname,filename)

            }else{
                productData.image=req.body.image
                farmProductData.image=req.body.image
            }


            var product = await repo.updateProduct(req.params.productID,productData)
            
            farmProductData.status = product.status
            farmProductData.category = product.category
            var farm = await farmService.updateProductToFarm(product.farm._id,farmProductData)
            if(!farm){
                res.status(404).send()
                return;
            }

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
            var farm = await farmService.deleteProductToFarm(product.farm._id,product._id)
            farm ?
                res.status(status.OK).json(product)             
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })




    router.put('/:productID/media', async (req,res) => {
        if(req.body.constructor === Object && Object.keys(req.body).length === 0){
            res.status(200).send({'msg': 'no medias'})

        }else{
            const mediaData = {
                media: req.body
            }
            
            try{
                var product = await repo.updateProductMedia(req.params.productID,mediaData)
                product ?
                    res.status(status.OK).json(product)
                :
                    res.status(404).send()
            } catch (err) {
                res.status(400).send({'msg': err.message})
            }
        }

    })

    router.put('/:productID/complete', async (req,res) => {
        
       
        try{
            var product = await repo.getProduct(req.params.productID)
            var productCompleted= product.steps.every((step) => step.status === constants.step.status.completed)

            if(productCompleted){
                product.status = constants.product.status.completed
                product.labelUrl= constants.product.labelUrl + product._id
                await product.save()
                var qrcodeBase64String = await QRCode.toDataURL(product.labelUrl)
                let qrcodeBase64Image = qrcodeBase64String.split(';base64,').pop();
                var pathname = path.join( '/product', product._id.toString())
                var completePath = path.join(storagePath,pathname)
                var qrcodeFileName='qrcode.png'
                var generateQRCODE = await storageService.saveBase64ToDir(qrcodeBase64Image,qrcodeFileName,completePath)
                product.qrcode.base64 = qrcodeBase64String
                product.qrcode.src = path.join(pathname,qrcodeFileName)
                product.flyer = await advService.singleProductFlyer(product)
                await product.save()
                var farmProductData= {
                    _id: req.params.productID,
                    name: product.name,
                    image: product.image,
                    updatedAt: Date.now(),
                    status: product.status,
                    category: product.category
                }
                var farm = await farmService.updateProductToFarm(product.farm._id,farmProductData)
                res.status(status.OK).json(product)
            }else
                res.status(400).send({'msg': 'steps not completed'})
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }

    })
    
    router.put('/:productID/farm', async (req,res) => {
        var productFarmData = {
            farm: req.body
        }

        try{
            var product = await repo.updateFarm(req.params.productID,productFarmData)
            product ?
                res.status(status.OK).json(product)
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }





    })
    router.put('/:productID/rawproducts', async (req,res) => {
        if(req.body.constructor === Object && Object.keys(req.body).length === 0){
            res.status(200).send({'msg': 'no raw products'})

        }else{
            const rawProductsData = {
                rawProducts: req.body
            }
            
            try{
                var product = await repo.updateProductRawProducts(req.params.productID,rawProductsData)
                product ?
                    res.status(status.OK).json(product)
                :
                    res.status(404).send()
            } catch (err) {
                res.status(400).send({'msg': err.message})
            }
        }

    })

    return router;
}