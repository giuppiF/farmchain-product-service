'use strict'
const status = require('http-status')
const router = require('express').Router();
const path = require('path')

module.exports = (options) => {
    const {repo, storageService, storagePath, productService, auth} = options

    router.post('/:productID/extra', auth.required, auth.isFarmAdmin, async (req,res) => {
        try{
            var extraData = {
                title: req.body.title,
                content: req.body.content,
                type: req.body.type,
                status: req.body.status,
                image: 'placeholder'
            }


            var extra = await repo.addExtra(req.params.productID,extraData)
            extraData._id = extra._id
            if(req.files.image){
                var image = req.files.image
    
                var filename = Date.now()+ '-' + image.originalFilename
                var pathname = path.join(req.originalUrl, extra._id.toString())
                var completePathname = path.join(storagePath, pathname)
                var uploadfile = await storageService.saveToDir(image.path, filename, completePathname )
                extraData.image = path.join(pathname, filename)
            }
            
            var addExtraImage = await repo.updateExtra(req.params.productID,extra._id,extraData) 
            res.status(status.OK).json(addExtraImage)

        }catch (err) {
            res.status(400).json({msg: err.message})
        }

    })

    router.put('/:productID/extra/:extraID', auth.required, auth.isFarmAdmin, async (req,res) => {


        var extraData = {
            _id: req.params.extraID,
            title: req.body.title,
            content: req.body.content,
            type: req.body.type,
            status: req.body.status,
        }
        try{
            if(req.files.image){
                
                var pathname = req.originalUrl
                var completePathname = path.join(storagePath, pathname)
                var extra = await repo.getExtra(req.params.productID,req.params.extraID)
                if(extra.image)
                    var deleteFile = await storageService.deleteFile(extra.image,storagePath)            

                var image = req.files.image    
                var filename = Date.now()+ '-' + image.originalFilename
                
                var uploadfile = await storageService.saveToDir(image.path, filename, completePathname )
                extraData.image = path.join(pathname,filename)
                

            }else{
                extraData.image=req.body.image
            }

            var product = await repo.updateExtra(req.params.productID,req.params.extraID,extraData) 

           
            product ?
                res.status(status.OK).json(product)
            :            
                res.status(404).send()
     
        } catch (err) {
            res.status(400).send({'msg' : err.message})
        }
    })

    router.delete('/:productID/extra/:extraID', auth.required, auth.isFarmAdmin, async (req,res) => {
        try{
            var pathname = path.join(storagePath, req.originalUrl)
            var extra = await repo.getExtra(req.params.productID,req.params.extraID)
            if(extra.image){
                var deleteFile = await storageService.deleteFile(extra.image,storagePath)  
                var deleteDir = await storageService.deleteDir(pathname) 
            }
                
            var product = await repo.deleteExtra(req.params.productID,req.params.extraID)


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