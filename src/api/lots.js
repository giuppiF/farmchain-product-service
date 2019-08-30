'use strict'
const status = require('http-status')
const router = require('express').Router();


module.exports = (options) => {
    const {repo, auth} = options
    
       /**
   * @swagger
   * tags:
   *   name: ProductLots
   *   description: List Product's Lots API
   */
   /**
   * @swagger
   * /product/{productId}/lot:
   *   put:
   *     summary: Create Product's Lot
   *     description: API for product's lot creation
   *     tags: [ProductLots]
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
   *                   $ref: '#/components/schemas/ProductLot'
   *     responses:
   *             200:
   *                 description: Product object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Lot not created for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Lot not created for a generic database error
   *                            
   */
    router.put('/:productID/lot', auth.required, auth.isFarmAdmin, async (req,res) => {
        if(req.body.constructor === Object && Object.keys(req.body).length === 0){
            res.status(200).send({'msg': 'no lots'})

        }else{
            const lotsData = {
                lots: req.body
            }
            
            try{
                var product = await repo.updateProduct(req.params.productID,lotsData)
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
   * /product/{productId}/lot/{lotId}:
   *   put:
   *     summary: Update Product's Lot
   *     description: API for product's lot update
   *     tags: [ProductLots]
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
   *        - name: lotId
   *          in: path
   *          required: true
   *          description: Lot id string
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
   *               $ref: '#/components/schemas/ProductLot'
   *     responses:
   *             200:
   *                 description: Product object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Lot not updated for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Lot not updated for a generic database error
   *                            
   */

    router.put('/:productID/lot/:lotID', auth.required, auth.isFarmAdmin, async (req,res) => {

        var lotData = {
            _id: req.params.lotID,
            name: req.body.name,
            description: req.body.description,
            image: req.body.image
        }
        try{
            var product = await repo.updateProductLot(req.params.productID,lotData._id,lotData) 
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
   * /product/{productId}/lot/{lotId}:
   *   delete:
   *     summary: Delete Product's Lot
   *     description: Delete a single product
   *     security:
   *        - bearerAuth: []
   *     tags: [ProductLots]
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
   *        - name: lotId
   *          in: path
   *          required: true
   *          description: Lot id string
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
   *                 description: Lot not found
   */
    router.delete('/:productID/lot/:lotID', auth.required, auth.isFarmAdmin, async (req,res) => {
        try{
            var product = await repo.deleteProductLot(req.params.productID,req.params.lotID)
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