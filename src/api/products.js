'use strict'
const status = require('http-status')
const router = require('express').Router();
const path = require('path')
const QRCode = require('qrcode')


module.exports = (options) => {
    const {repo, farmService, blockchainService, storageService, storagePath,advService, constants, auth} = options
       /**
   * @swagger
   * tags:
   *   name: Product
   *   description: Product API list 
   */

   /**
   * @swagger
   * components:
   *   securitySchemes:
   *     bearerAuth:            # arbitrary name for the security scheme
   *       type: http
   *       scheme: bearer
   *       bearerFormat: JWT
   */

   /**
   * @swagger
   * /product:
   *   get:
   *     summary: Get All Products
   *     description: Lists all products
   *     tags: [Product]
   *     produces:
   *       - application/json
   *     responses:
   *             200:
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   */
    router.get('/', async (req,res) => {
        var products = await repo.getAllProducts();
        res.status(status.OK).json(products)
    })
  /**
   * @swagger
   * /product:
   *   post:
   *     summary: Create Product
   *     description: API for product creation
   *     tags: [Product]
   *     security:
   *        - bearerAuth: []
   *     produces:
   *       - application/json
   *     requestBody:
   *        content:
   *            multipart/form-data:
   *             schema:
   *               type: object
   *               properties:
   *                 name:
   *                   name: name
   *                   description: Product's name
   *                   in: formData
   *                   required: true
   *                   type: string
   *                   example: Il bel prodotto
   *                 description:
   *                   name: description
   *                   description: Product's description
   *                   in: formData
   *                   required: true
   *                   type: string
   *                   example: Molto bello
   *                 image:
   *                   name: image
   *                   description: Product's image
   *                   in: formData
   *                   required: false
   *                   type: string
   *                   example: /product/image_prodct_type.jpg
   *                 farm:
   *                   name: farm
   *                   description: Product's farm
   *                   in: formData
   *                   required: true
   *                   type: object
   *                   properties:
   *                      _id:
   *                          name: _id
   *                          description: Farm id
   *                          in: formData
   *                          required: false
   *                          type: string
   *                          example: 123123123
   *                      description:
   *                          name: description
   *                          description: Farm description
   *                          in: formData
   *                          required: false
   *                          type: string
   *                          example: la bella farm
   *                      logo:
   *                          name: logo
   *                          description: Farm logo
   *                          in: formData
   *                          required: false
   *                          type: string
   *                          example: image.jpg
   *                      address:
   *                          name: address
   *                          description: Farm's address
   *                          in: formData
   *                          required: true
   *                          type: string
   *                          example: Via Roma 10 - 10100  Torino
   *                      mail:
   *                          name: mail
   *                          description: Farm's mail
   *                          in: formData
   *                          required: true
   *                          type: string
   *                          format: email
   *                          example: mail@mail.it
   *                      phone:
   *                          name: phone
   *                          description: Farm's phone
   *                          in: formData
   *                          required: true
   *                          type: string
   *                          example: 333 1223321
   *                      websiteURL:
   *                          name: websiteURL
   *                          description: Farm's website URL
   *                          in: formData
   *                          required: false
   *                          type: string
   *                 expiration:
   *                   name: expiration
   *                   description: Product's expiration
   *                   in: formData
   *                   required: false
   *                   type: string
   *                   example: 2019-05-19
   *                 labelUrl:
   *                   name: labelUrl
   *                   description: Product's label URL
   *                   in: formData
   *                   required: false
   *                   type: string
   *                   example: www.label.it
   *                 qrcode:
   *                   name: qrcode
   *                   description: Product's QR code
   *                   in: formData
   *                   required: true
   *                   type: object
   *                   properties:
   *                      src:
   *                          name: src
   *                          description: QR code src
   *                          in: formData
   *                          required: false
   *                          type: string
   *                          example: /qrcode.jpg
   *                      base64:
   *                          name: base64
   *                          description: QR code base 64
   *                          in: formData
   *                          required: false
   *                          type: string
   *                          example: 12312312123123
   *                 status:
   *                   name: site
   *                   description: Product's status
   *                   in: formData
   *                   required: false
   *                   type: string
   *                   enum: [In Progress, Completed]
   *                 category:
   *                   name: category
   *                   description: Product's category
   *                   in: formData
   *                   required: true
   *                   type: string
   *                   enum: [Frutta, Verdura]
   *                   example: Frutta
   *                 steps:
   *                   name: steps
   *                   description: Product's steps
   *                   in: formData
   *                   required: true
   *                   type: object
   *                   properties:
   *                        name:
   *                          name: name
   *                          description: Step's name
   *                          in: formData
   *                          required: true
   *                          type: string
   *                          example: Semina
   *                        description:
   *                          name: description
   *                          description: Step's description
   *                          in: formData
   *                          required: true
   *                          type: string
   *                        icon:
   *                          name: icon
   *                          description: Step's icon
   *                          in: formData
   *                          required: true
   *                          type: string
   *                        status:
   *                          name: status
   *                          description: Step's status
   *                          in: formData
   *                          required: false
   *                          type: string
   *                          enum: [Current, Next, Completed]
   *                        order:
   *                          name: order
   *                          description: Step's order
   *                          in: formData
   *                          required: true
   *                          type: string
   *                        media:
   *                          type: array
   *                          items:
   *                          $ref: '#/components/schemas/ProductMedia'
   *                        date:
   *                          name: date
   *                          description: Step's date
   *                          in: formData
   *                          required: true
   *                          type: string
   *                 lots:
   *                   name: lots
   *                   description: Product's lots
   *                   in: formData
   *                   required: true
   *                   type: object
   *                   properties:
   *                     name:
   *                         name: name
   *                         description: Lot's name
   *                         in: formData
   *                         required: true
   *                         type: string
   *                         example: Lotto
   *                     description:
   *                         name: description
   *                         description: Lot's description
   *                         in: formData
   *                         required: false
   *                         type: string
   *                     image:
   *                         name: image
   *                         description: Lot's image
   *                         in: formData
   *                         required: false
   *                         type: string
   *                         format: binary
   *               required:
   *                    - name
   *                    - description
   *                    - farm
   *                    - category
   *                    - steps
   *                    - lots
   *     responses:
   *             200:
   *                 description: Product created object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Product not created for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Product not created for a generic database error
   *                            
   */
    router.post('/', auth.required, auth.isFarmAdminForCreation, async (req,res) => {
          
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
                var pathname = path.join('/farm',res.locals.farmId.toString(), req.originalUrl, product._id.toString())
                var templateFile =  image
                var uploadfile = await storageService.copyTemplateFile(templateFile, filename, pathname )
                product.image = path.join(pathname, filename)
                product.save()
            }
        } catch (err) {
            res.status(400).send({'msg': err.message})
            return
        }
        

        try{

            var publishEvent =await options.kafkaService.publishEvent("service.product","create.product",product);

            res.status(status.OK).json(product)


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
     /**
   * @swagger
   * /product/{productId}:
   *   get:
   *     summary: Get Product
   *     description: Get a single product
   *     tags: [Product]
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: productId
   *          in: path
   *          required: true
   *          description: Product id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *     responses:
   *             200:
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Application error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Product not found
   */
    router.get('/:productID', auth.optional, async (req,res) => {
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


  /**
   * @swagger
   * /product/{productId}:
   *   put:
   *     summary: Update Product
   *     description: API for product update
   *     tags: [Product]
   *     security:
   *        - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: productId
   *          in: path
   *          required: true
   *          description: Product id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *     requestBody:
   *        content:
   *            multipart/form-data:
   *             schema:
   *               type: object
   *               properties:
   *                 name:
   *                   name: name
   *                   description: Product's name
   *                   in: formData
   *                   required: true
   *                   type: string
   *                   example: Il bel prodotto
   *                 description:
   *                   name: description
   *                   description: Product's description
   *                   in: formData
   *                   required: true
   *                   type: string
   *                   example: Molto bello
   *                 image:
   *                   name: image
   *                   description: Product's image
   *                   in: formData
   *                   required: false
   *                   type: string
   *                   format: binary
   *                 expiration:
   *                   name: expiration
   *                   description: Product's expiration
   *                   in: formData
   *                   required: false
   *                   type: string
   *                   example: 2019-05-19
   *               required:
   *                    - name
   *                    - description
   *                    - image
   *                    - expiration
   *            application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 name:
   *                   name: name
   *                   description: Product's name
   *                   in: formData
   *                   required: true
   *                   type: string
   *                   example: Il bel prodotto
   *                 description:
   *                   name: description
   *                   description: Product's description
   *                   in: formData
   *                   required: true
   *                   type: string
   *                   example: Molto bello
   *                 image:
   *                   name: image
   *                   description: Product's image
   *                   in: formData
   *                   required: false
   *                   type: string
   *                   example: /product/image_prodct_type.jpg
   *                 expiration:
   *                   name: expiration
   *                   description: Product's expiration
   *                   in: formData
   *                   required: false
   *                   type: string
   *                   example: 2019-05-19
   *               required:
   *                    - name
   *                    - description
   *                    - image
   *                    - expiration
   *     responses:
   *             200:
   *                 description: Product created object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Product not updated for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Product not updated for a generic database error
   *                            
   */
    router.put('/:productID',auth.required, auth.isFarmAdmin, async (req,res) => {
        var productData = {
            _id: req.params.productID,
            name: req.body.name,
            image: req.body.image,
            updatedAt: Date.now()
        }
        try{

            if(req.files.image){
                
                var pathname = path.join('/farm',res.locals.farmId.toString(), req.originalUrl)
                var product = await repo.getProduct(req.params.productID)
                if(product.image)
                    var deleteFile = await storageService.deleteFileFromS3(product.image)            

                var image = req.files.image    
                var filename = Date.now()+ '-' + image.originalFilename
                
                var uploadfile = await storageService.uploadFileInS3(image.path, filename, pathname )
                productData.image = path.join(pathname,filename)

            }else{
                productData.image=req.body.image
            }

            if(req.body.description){
                productData.description = req.body.description;
            }
            if(req.body.expiration){
                productData.expiration = req.body.expiration;
            }

            var product = await repo.updateProduct(req.params.productID,productData)
            
            var publishEvent =await options.kafkaService.publishEvent("service.product","update.product",product);

            product ?
                res.status(status.OK).json(product)
            :
                res.status(404).send()
         } catch (err) {
            console.log("ERRORE UPDATE PRODUCT")
            res.status(400).send({'msg': err.message})
        }

    })
   /**
   * @swagger
   * /product/{productId}:
   *   delete:
   *     summary: Delete Product
   *     description: Delete a single product
   *     security:
   *        - bearerAuth: []
   *     tags: [Product]
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: productId
   *          in: path
   *          required: true
   *          description: Product id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *     responses:
   *             200:
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Application error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Product not found
   */
    router.delete('/:productID', auth.required, auth.isFarmAdmin, async (req,res) => {
        try{
            var product = await repo.deleteProduct(req.params.productID)
            if(!product){
                res.status(404).send()
                return
            }
            const { headers: { authorization } } = req;
            var publishEvent =await options.kafkaService.publishEvent("service.product","delete.product",product);
            product ?
                res.status(status.OK).json(product)             
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })


  /**
   * @swagger
   * /product/{productId}/media:
   *   put:
   *     summary: Update Product Media
   *     description: API for product media update
   *     tags: [Product,Media]
   *     security:
   *        - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: productId
   *          in: path
   *          required: true
   *          description: Product id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *     requestBody:
   *        content:
   *            application/json:
   *             schema:
   *               type: array
   *               description: Product's media
   *               required: true
   *               items:
   *                   $ref: '#/components/schemas/ProductMedia'
   *     responses:
   *             200:
   *                 description: Product created object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Product's Media not updated for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Product's Media not updated for a generic database error
   *                            
   */

    router.put('/:productID/media',auth.required, auth.isFarmAdmin, async (req,res) => {
        if(req.body.constructor === Object && Object.keys(req.body).length === 0){
            res.status(200).send({'msg': 'no medias'})

        }else{
            const mediaData = {
                media: req.body
            }
            
            try{
                var product = await repo.updateProduct(req.params.productID,mediaData)
                product ?
                    res.status(status.OK).json(product)
                :
                    res.status(404).send()
            } catch (err) {
                res.status(400).send({'msg': err.message})
            }
        }

    })
   /**
   * @swagger
   * /product/{productId}/complete:
   *   put:
   *     summary: Complete Product
   *     description: Complete a single product
   *     security:
   *        - bearerAuth: []
   *     tags: [Product]
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: productId
   *          in: path
   *          required: true
   *          description: Product id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *     responses:
   *             200:
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Application error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Product not found
   */
    router.put('/:productID/complete', auth.required, auth.isFarmAdmin,async (req,res) => {
        
       
        try{
            var product = await repo.getProduct(req.params.productID)
            var productCompleted= product.steps.every((step) => step.status === constants.step.status.completed)
            if(product.status !== constants.product.status.completed){
                res.status(status.OK).json({'msg': 'product already completed'})
            }else if(productCompleted){
                product.status = constants.product.status.completed
                product.labelUrl= constants.product.labelUrl + product._id
                await product.save()
                var qrcodeBase64String = await QRCode.toDataURL(product.labelUrl)
                let qrcodeBase64Image = qrcodeBase64String.split(';base64,').pop();
                var pathname = path.join( '/farm',res.locals.farmId.toString(),'/product', product._id.toString())
                var qrcodeFileName='qrcode.png'
                var generateQRCODE = await storageService.saveBase64ToS3(qrcodeBase64Image,qrcodeFileName,pathname)
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
                const { headers: { authorization } } = req;
                var publishEvent =await options.kafkaService.publishEvent("service.product","update.product",product);
                
                res.status(status.OK).json(product)
            }else
                res.status(400).send({'msg': 'steps not completed'})
        } catch (err) {
            console.log("ERRORE COMPLETE PRODUCT")
            res.status(400).send({'msg': err.message})
        }

    })
    

  /**
   * @swagger
   * /product/{productId}/farm:
   *   put:
   *     summary: Update Product Farm
   *     description: API for product farm update
   *     tags: [Product]
   *     security:
   *        - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: productId
   *          in: path
   *          required: true
   *          description: Product id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *     requestBody:
   *        content:
   *            application/json:
   *             schema:
   *               type: object
   *               properties:
   *                    _id:
   *                        name: _id
   *                        description: Farm id
   *                        in: formData
   *                        required: false
   *                        type: string
   *                    description:
   *                        name: description
   *                        description: Farm description
   *                        in: formData
   *                        required: false
   *                        type: string
   *                    logo:
   *                        name: logo
   *                        description: Farm logo
   *                        in: formData
   *                        required: false
   *                        type: string
   *                    address:
   *                        name: address
   *                        description: Farm's address
   *                        in: formData
   *                        required: true
   *                        type: string
   *                        example: Via Roma 10 - 10100  Torino
   *                    mail:
   *                        name: mail
   *                        description: Farm's mail
   *                        in: formData
   *                        required: true
   *                        type: string
   *                        format: email
   *                        example: mail@mail.it
   *                    phone:
   *                        name: phone
   *                        description: Farm's phone
   *                        in: formData
   *                        required: true
   *                        type: string
   *                        example: 333 1223321
   *                    websiteURL:
   *                        name: websiteURL
   *                        description: Farm's website URL
   *                        in: formData
   *                        required: false
   *                        type: string
   *     responses:
   *             200:
   *                 description: Product created object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Product's Farm not updated for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Product's Farm not updated for a generic database error
   *                            
   */
    router.put('/:productID/farm', auth.required, auth.isFarmAdmin,async (req,res) => {
        var productFarmData = {
            farm: req.body
        }

        try{
            var product = await repo.updateProduct(req.params.productID,productFarmData)
            product ?
                res.status(status.OK).json(product)
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }





    })

  /**
   * @swagger
   * /product/{productId}/rawproducts:
   *   put:
   *     summary: Update Product Raws
   *     description: API for product raws update
   *     tags: [Product]
   *     security:
   *        - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: productId
   *          in: path
   *          required: true
   *          description: Product id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *     requestBody:
   *        content:
   *            application/json:
   *             schema:
   *               type: array
   *               description: Product's raws array
   *               required: true
   *               items:
   *                   $ref: '#/components/schemas/ProductRaw'
   *     responses:
   *             200:
   *                 description: Product created object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Product's raw not updated for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Product's raw not updated for a generic database error
   *                            
   */
    router.put('/:productID/rawproducts', auth.required, auth.isFarmAdmin,async (req,res) => {
        if(req.body.constructor === Object && Object.keys(req.body).length === 0){
            res.status(401).send({'msg': 'no raw products'})

        }else{

            
            try{

                var rawProductsIDs = req.body
                var rawProducts = []
                var getRawProducts = rawProductsIDs.map( async (rawProductId)=> {
                    var rawProduct = await repo.getProduct(rawProductId)
                    rawProducts.push(rawProduct)
                })
                Promise.all(getRawProducts).then( async ()=>{
                    try{
                        var rawProductsData={
                            rawProducts: rawProducts
                        }
                        var product = await repo.updateProduct(req.params.productID,rawProductsData)
                        product ?
                            res.status(status.OK).json(product)
                        :
                            res.status(404).send()
                
                        
                    }catch (err) {
                        res.status(400).json({msg: err.message})
                    }
                })
                
            } catch (err) {
                res.status(400).send({'msg': err.message})
            }
        }

    })

    return router;
}