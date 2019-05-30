'use strict'
const status = require('http-status')
const router = require('express').Router();
const path = require('path')


module.exports = (options) => {
    const {repo,storageService, storagePath} = options
           /**
   * @swagger
   * tags:
   *   name: ProductTypes
   *   description: Product Types API list 
   */

   /**
   * @swagger
   * /product/types:
   *   get:
   *     summary: Get All Products Types
   *     description: Lists all products types
   *     tags: [ProductTypes]
   *     produces:
   *       - application/json
   *     responses:
   *             200:
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/ProductType'
   */
    router.get('/', async (req,res) => {
        var productTypes = await repo.getProductTypes();
        res.status(status.OK).json(productTypes)
    })

          /**
   * @swagger
   * /product/types:
   *   post:
   *     summary: Create Product Type
   *     description: API for product type creation
   *     tags: [ProductTypes]
   *     security:
   *        - bearerAuth: []
   *     produces:
   *       - application/json
   *     requestBody:
   *        content:
   *            multipart/form-data:
   *             schema:
   *               type: object
   *               $ref: '#/components/schemas/ProductType'
   *     responses:
   *             200:
   *                 description: Product object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/ProductType'
   *             400:
   *                 description:  Product Type not created for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description:  Product Type not created for a generic database error
   *                            
   */
    router.post('/', async (req,res) => {
        const productTypeData = {
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            steps: req.body.steps,
        }

        try{
            var productType = await repo.createProductType(productTypeData)

            productTypeData._id = productType._id
            if(req.files.image){
                var image = req.files.image
    
                var filename = Date.now()+ '-' + image.originalFilename
                var pathname = req.originalUrl
                var completePath = path.join(storagePath,pathname)
                var uploadfile = await storageService.saveToDir(image.path, filename, completePath )
                productType.image = path.join(pathname,filename)
                productType.save()

            }

            productType ?
                res.status(status.OK).json(productType)
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })
   /**
   * @swagger
   * /product/types/{productTypeId}:
   *   put:
   *     summary: Update Product type
   *     description: API for product type
   *     tags: [ProductTypes]
   *     security:
   *        - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: productTypeId
   *          in: path
   *          required: true
   *          description: Product type id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *     requestBody:
   *        content:
   *            multipart/form-data:
   *             schema:
   *               type: object
   *               $ref: '#/components/schemas/ProductType'
   *     responses:
   *             200:
   *                 description: Product type object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/ProductType'
   *             400:
   *                 description: Product type  not updated for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Product type  not updated for a generic database error
   *                            
   */

    router.put('/:productTypeID', async (req,res) => {
        const productTypeData = {
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            steps: req.body.steps,
        }

        try{
            if(req.files.image){
                
                var pathname = path.join('product','types')
                var completePathname = path.join(storagePath, pathname)
                var productType = await repo.getProductType(req.params.productTypeID)
                if(productType.image){
                    var filename = path.join(pathname,productType.image)
                    var deleteFile = await storageService.deleteFile(filename,storagePath)            
                }

                var image = req.files.image    
                var filename = Date.now()+ '-' + image.originalFilename
                
                var uploadfile = await storageService.saveToDir(image.path, filename, completePathname )
                productTypeData.image = path.join(pathname,filename)

                

            }else{
                productTypeData.image=req.body.image
            }

            var productType = await repo.updateProductType(req.params.productTypeID,productTypeData)
            productType ?
                res.status(status.OK).json(productType)
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })

   /**
   * @swagger
   * /product/types/{productTypeId}:
   *   delete:
   *     summary: Delete Product type
   *     description: Delete a single product type
   *     security:
   *        - bearerAuth: []
   *     tags: [ProductTypes]
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: productTypeId
   *          in: path
   *          required: true
   *          description: Product type id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *     responses:
   *             200:
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/ProductType'
   *             400:
   *                 description: Application error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Product type not found
   */
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