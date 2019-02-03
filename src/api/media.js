'use strict'
const status = require('http-status')
const router = require('express').Router();
const path = require('path')

module.exports = (options) => {
    const {repo, storagePath, storageService, blockchainService} = options
    

    router.post('/', async (req,res) => {
        try{

            var medias = []
            var mediaFiles = []
            var products = []
            if(!Array.isArray(req.files.media))
                mediaFiles.push(req.files.media)
            else    
                mediaFiles = req.files.media
    
            if(!Array.isArray(req.body.products))
                products.push(req.body.products)
            else    
                products =req.body.products
    
            var loadMedia = mediaFiles.map( async (mediaFile)=> {
                const mediaData = {
                    date: req.body.date,
                    location: req.body.location
                }
    
                var media = await repo.createMedia(mediaData)
                mediaData._id = media._id
                try{
                    
                    var filename = Date.now()+ '-' + mediaFile.originalFilename
                    var pathname = path.join(req.originalUrl, media._id.toString())
                    var completePath = path.join(storagePath,pathname)
                    var uploadfile = await storageService.saveToDir(mediaFile.path, filename, completePath )
                    media.src= path.join(pathname,filename)
                    var smartContract = await blockchainService.createMediaSmartContract()
                    media.smartContract = smartContract
                    media.save()
                    medias.push(media)
    
                    
                }catch (err) {
                    res.status(400).json({msg: err.message})
                }
            })
    
            Promise.all(loadMedia).then( async ()=>{
                try{
                    var updateProductsMedia = products.map( async (productId) => {
                        var updateProductMedia = await repo.addMediasToProduct(productId,  medias)
                    })
                    await Promise.all(updateProductsMedia).then( async ()=>{
                        try{
                            res.status(status.OK).json(medias)
                        }catch (err) {
                            res.status(400).json({msg: err.message})
                        }
                    })
    
                    
                }catch (err) {
                    res.status(400).json({msg: err.message})
                }
            })
        } catch (err) {
            res.status(400).json({msg: err.message})
        }

    })



    return router;
}