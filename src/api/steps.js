'use strict'
const status = require('http-status')
const router = require('express').Router();


module.exports = (options) => {
    const {repo, constants, auth} = options
    
       /**
   * @swagger
   * tags:
   *   name: ProductSteps
   *   description: List Product's Steps API
   */
          /**
   * @swagger
   * /product/{productId}/step:
   *   post:
   *     summary: Create Product's Step
   *     description: API for product's step creation
   *     tags: [ProductSteps]
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
   *     produces:
   *       - application/json
   *     requestBody:
   *        content:
   *            multipart/form-data:
   *             schema:
   *               type: object
   *               $ref: '#/components/schemas/ProductStep'
   *     responses:
   *             200:
   *                 description: Product object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Step not created for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Step not created for a generic database error
   *                            
   */

    router.post('/:productID/step/', auth.required, auth.isFarmAdmin, async (req,res) => {
        try{
            var stepData = {
                name: req.body.name,
                description: req.body.description,
                icon: req.body.icon,
                status:constants.step.status.next,
                order: req.body.order
            }
            var product = await repo.getProduct(req.params.productID)
            if(product.steps.every((step) => step.status !== constants.step.status.current))
                stepData.status = constants.step.status.current

            var step = await repo.addStep(req.params.productID,stepData)

            res.status(status.OK).json(step)

        }catch (err) {
            res.status(400).json({msg: err.message})
        }

    })


   /**
   * @swagger
   * /product/{productId}/step:
   *   put:
   *     summary: Update Product's Steps MASSIVE
   *     description: API for product's steps updated
   *     tags: [ProductSteps]
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
   *                   $ref: '#/components/schemas/ProductStep'
   *     responses:
   *             200:
   *                 description: Product object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Steps not updated for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Steps not updated for a generic database error
   *                            
   */


    router.put('/:productID/step', auth.required, auth.isFarmAdmin, async (req,res) => {
        if(req.body.constructor === Object && Object.keys(req.body).length === 0){
            res.status(200).send({'msg': 'no steps'})

        }else{
            const stepsData = {
                steps: req.body
            }
            
            try{
                var product = await repo.updateProduct(req.params.productID,stepsData)
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
   * /product/{productId}/step/{stepId}:
   *   put:
   *     summary: Update Product's Step
   *     description: API for product's Step update
   *     tags: [ProductSteps]
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
   *        - name: stepId
   *          in: path
   *          required: true
   *          description: Step id string
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
   *               $ref: '#/components/schemas/ProductStep'
   *     responses:
   *             200:
   *                 description: Product object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Product'
   *             400:
   *                 description: Step not updated for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Step not updated for a generic database error
   *                            
   */


    router.put('/:productID/step/:stepID', auth.required, auth.isFarmAdmin, async (req,res) => {

        var stepData = {
            _id: req.params.stepID,
            name: req.body.name,
            description: req.body.description,
            icon: req.body.icon,
            status:req.body.status,
            order: req.body.order,
            media: req.body.media,
        }
        try{
            var product = await repo.updateStep(req.params.productID,stepData._id,stepData) 
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
   * /product/{productId}/step/{stepId}/close:
   *   put:
   *     summary: Close Product's Step
   *     description: Close a single product step
   *     security:
   *        - bearerAuth: []
   *     tags: [ProductSteps]
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
   *        - name: stepId
   *          in: path
   *          required: true
   *          description: Step id string
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
   *                 description: Step not found
   */

    router.put('/:productID/step/:stepID/close/', auth.required, auth.isFarmAdmin, async (req,res) => {

        var stepData = {
            status: constants.step.status.completed
        }

        try{
            
            var product = await repo.updateStatusStep(req.params.productID,req.params.stepID,stepData)
            var firstStep = product.steps.find((step) => {return step.status === constants.step.status.next})
            if(firstStep)
                firstStep.status = constants.step.status.current
              
            var thisStep = product.steps.find((step) => {return step._id == req.params.stepID})

            if(thisStep.media.length > 0){
                var mediaDates  = thisStep.media.map(media => media.timestamp)
                thisStep.date = Math.max.apply(null, mediaDates)   
            }else
                thisStep.date = Date.now()


            product.save()
        

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
   * /product/{productId}/step/{stepId}:
   *   delete:
   *     summary: Delete Product's Step
   *     description: Delete a single product step
   *     security:
   *        - bearerAuth: []
   *     tags: [ProductSteps]
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
   *        - name: stepId
   *          in: path
   *          required: true
   *          description: Step id string
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
   *                 description: Step not found
   */
    router.delete('/:productID/step/:stepID', auth.required, auth.isFarmAdmin, async (req,res) => {
        try{
            var step = await repo.getStep(req.params.productID,req.params.stepID)
            var product = await repo.deleteStep(req.params.productID,req.params.stepID)
            if(step.status == constants.step.status.current){
                var firstStep = product.steps.find((step) => {return step.status === constants.step.status.next})

                if(firstStep){
                    product = await repo.updateStatusStep(req.params.productID,firstStep._id,{status: constants.step.status.current})
                }
            }

            
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