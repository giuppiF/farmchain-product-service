'use strict'
const status = require('http-status')
const router = require('express').Router();


module.exports = (options) => {
    const {repo, constants} = options
    


    router.post('/:productID/step/', async (req,res) => {
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



    router.put('/:productID/step', async (req,res) => {
        if(req.body.constructor === Object && Object.keys(req.body).length === 0){
            res.status(200).send({'msg': 'no steps'})

        }else{
            const stepsData = {
                steps: req.body
            }
            
            try{
                var product = await repo.updateSteps(req.params.productID,stepsData)
                product ?
                    res.status(status.OK).json(product)
                :
                    res.status(404).send()
            } catch (err) {
                res.status(400).send({'msg': err.message})
            }
        }

    })

    router.put('/:productID/step/:stepID', async (req,res) => {

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

    router.put('/:productID/step/:stepID/close/', async (req,res) => {

        var stepData = {
            status: constants.step.status.completed
        }

 
        var currentFound = false
        try{
            
            var product = await repo.updateStatusStep(req.params.productID,req.params.stepID,stepData)
            var firstStep = product.steps.find((step) => {return step.status === constants.step.status.next})
            if(firstStep)
                product = await repo.updateStatusStep(req.params.productID,firstStep._id,{status: constants.step.status.current})

            product ?
                res.status(status.OK).json(product)
            :            
                res.status(404).send()

            
        } catch (err) {
            res.status(400).send({'msg' : err.message})
        }
    })

    router.delete('/:productID/step/:stepID', async (req,res) => {
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