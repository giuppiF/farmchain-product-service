'use strict'
const status = require('http-status')
const router = require('express').Router();


module.exports = (options) => {
    const {repo, auth} = options
       /**
   * @swagger
   * tags:
   *   name: ProductDealers
   *   description: List Product's Dealers API
   */
   /**
   * @swagger
   * /product/{productId}/dealer:
   *   put:
   *     summary: Create Product's Dealer
   *     description: API for product's dealer creation
   *     tags: [ProductDealers]
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
   *               type: array
   *               items:
   *                   $ref: '#/components/schemas/ProductDealer'
   *     responses:
   *             200:
   *                 description: Product object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Dealer not created for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Dealer not created for a generic database error
   *                            
   */
    router.put('/:productID/dealer', auth.required, auth.isFarmAdmin, async (req,res) => {
        if(req.body.constructor === Object && Object.keys(req.body).length === 0){
            res.status(200).send({'msg': 'no dealers'})

        }else{
            const dealersData = {
                dealers: req.body
            }
            
            try{
                var product = await repo.updateProduct(req.params.productID,dealersData)
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
   * /product/{productId}/dealer/{dealerId}:
   *   put:
   *     summary: Update Product's Dealer
   *     description: API for product's dealer update
   *     tags: [ProductDealers]
   *     security:
   *        - bearerAuth: []
   *     parameters:
   *        - name: productId
   *          in: path
   *          required: true
   *          description: Product id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *        - name: dealerId
   *          in: path
   *          required: true
   *          description: Dealer id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *     produces:
   *       - application/json
   *     requestBody:
   *        content:
   *            multipart/form-data:
   *             schema:
   *               type: object
   *               $ref: '#/components/schemas/ProductDealer'
   *     responses:
   *             200:
   *                 description: Product object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Dealer not updated for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Dealer not updated for a generic database error
   *                            
   */

    router.put('/:productID/dealer/:dealerID', auth.required, auth.isFarmAdmin, async (req,res) => {

        var dealerData = {
            _id: req.params.dealerID,
            name: req.body.name,
            phone: req.body.phone,
            mail: req.body.mail,
            address: req.body.address,
            image: req.body.image
        }
        try{
            var product = await repo.updateProductDealer(req.params.productID,dealerData._id,dealerData) 
            product ?
                res.status(status.OK).json(product)
            :            
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg' : err.message})
        }
    })

     /**
   * @swagger
   * /product/{productId}/dealer/{dealerId}:
   *   delete:
   *     summary: Delete Product's Dealer
   *     description: Delete a single product
   *     security:
   *        - bearerAuth: []
   *     tags: [ProductDealers]
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
   *        - name: dealerId
   *          in: path
   *          required: true
   *          description: Dealer id string
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
   *                 description: Dealer not found
   */
    router.delete('/:productID/dealer/:dealerID', auth.required, auth.isFarmAdmin, async (req,res) => {
        try{
            var product = await repo.deleteProductDealer(req.params.productID,req.params.dealerID)
            product ?
                res.status(status.OK).json(product)
            :            
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg' : err.message})
        }
    })


    return router;
}