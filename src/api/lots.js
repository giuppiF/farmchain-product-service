'use strict'
const status = require('http-status')
const router = require('express').Router();


module.exports = (options) => {
    const {repo, auth} = options
    

    router.put('/:productID/lot', auth.required, auth.isFarmAdmin, async (req,res) => {
        if(req.body.constructor === Object && Object.keys(req.body).length === 0){
            res.status(200).send({'msg': 'no lots'})

        }else{
            const lotsData = {
                lots: req.body
            }
            
            try{
                var product = await repo.updateLots(req.params.productID,lotsData)
                product ?
                    res.status(status.OK).json(product)
                :
                    res.status(404).send()
            } catch (err) {
                res.status(400).send({'msg': err.message})
            }
        }

    })

    router.put('/:productID/lot/:lotID', auth.required, auth.isFarmAdmin, async (req,res) => {

        var lotData = {
            _id: req.params.lotID,
            name: req.body.name,
            description: req.body.description,
            image: req.body.image
        }
        try{
            var product = await repo.updateLot(req.params.productID,lotData._id,lotData) 
            product ?
                res.status(status.OK).json(product)
            :            
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg' : err.message})
        }
    })

    router.delete('/:productID/lot/:lotID', auth.required, auth.isFarmAdmin, async (req,res) => {
        try{
            var product = await repo.deleteLot(req.params.productID,req.params.lotID)
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