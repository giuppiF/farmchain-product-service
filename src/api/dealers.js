'use strict'
const status = require('http-status')
const router = require('express').Router();


module.exports = (options) => {
    const {repo, auth} = options
    

    router.put('/:productID/dealer', auth.required, auth.isFarmAdmin, async (req,res) => {
        if(req.body.constructor === Object && Object.keys(req.body).length === 0){
            res.status(200).send({'msg': 'no dealers'})

        }else{
            const dealersData = {
                dealers: req.body
            }
            
            try{
                var product = await repo.updateDealers(req.params.productID,dealersData)
                product ?
                    res.status(status.OK).json(product)
                :
                    res.status(404).send()
            } catch (err) {
                res.status(400).send({'msg': err.message})
            }
        }

    })

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
            var product = await repo.updateDealer(req.params.productID,dealerData._id,dealerData) 
            product ?
                res.status(status.OK).json(product)
            :            
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg' : err.message})
        }
    })

    router.delete('/:productID/dealer/:dealerID', auth.required, auth.isFarmAdmin, async (req,res) => {
        try{
            var product = await repo.deleteDealer(req.params.productID,req.params.dealerID)
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