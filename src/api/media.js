'use strict'
const status = require('http-status')
const router = require('express').Router();
const path = require('path')
const mime = require('mime')

module.exports = (options) => {
    const {repo, storagePath, storageService, blockchainService, auth} = options
    
   /**
   * @swagger
   * /product/media:
   *   post:
   *     summary: Create Media 
   *     description: API for media creation
   *     tags: [Media]
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
   *                 products:
   *                   name: ProductsId
   *                   type: array
   *                   items:
   *                       type: string
   *                 media:
   *                   name: Media
   *                   type: array
   *                   items:
   *                       type: string
   *                       format: binary
   *                 geolocal:
   *                   name: Geolocal
   *                   type: object
   *                   properties:
   *                     timestamp:
   *                       name: Timestamp
   *                       type: string
   *                     coords:
   *                       name: Coordinates
   *                       type: object
   *                       properties:
   *                          latitude:
   *                            name: Latitude
   *                            type: string
   *                          longitude:
   *                            name: Longitude
   *                            type: string
   *     responses:
   *             200:
   *                 description: Medias object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Media'
   *             400:
   *                 description: Steps not updated for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Steps not updated for a generic database error
   *                            
   */

    router.post('/', auth.required, auth.isFarmAdminMedia, async (req,res) => {
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

            
            var geolocal = JSON.parse(req.body.geolocal)
            var loadMedia = mediaFiles.map( async (mediaFile)=> {
                const mediaData = {
                    timestamp: geolocal.timestamp,
                    location: {
                        longitude: geolocal.coords.longitude,
                        latitude: geolocal.coords.latitude
                    }
                }

    
                var media = await repo.createMedia(mediaData)
                mediaData._id = media._id
                try{
                    
                    var filename = Date.now()+ '-' + mediaFile.originalFilename

                    filename = filename.replace('mp4','MP4')
                    var pathname = path.join('/farm',res.locals.farmId.toString(),req.originalUrl, media._id.toString())
                    var uploadfile = await storageService.uploadFileInS3(mediaFile.path, filename, pathname )
                    media.src= path.join(pathname,filename)
                    var smartContract = await blockchainService.createMediaSmartContract()
                    media.smartContract = smartContract
                    var fileMime = mime.getType(mediaFile.path);
                    if(fileMime.includes('video'))
                        media.type='video'
                    else
                        media.type='image'
                    media.muted = true
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
     /**
   * @swagger
   * /product/media/step:
   *   post:
   *     summary: Create Media 
   *     description: API for media creation
   *     tags: [Media]
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
   *                 product:
   *                   name: ProductId
   *                   type: string
   *                 step:
   *                   name: StepId
   *                   type: string
   *                 media:
   *                   name: Media
   *                   type: array
   *                   items:
   *                       type: string
   *                       format: binary
   *                 geolocal:
   *                   name: Geolocal
   *                   type: object
   *                   properties:
   *                     timestamp:
   *                       name: Timestamp
   *                       type: string
   *                     coords:
   *                       name: Coordinates
   *                       type: object
   *                       properties:
   *                          latitude:
   *                            name: Latitude
   *                            type: string
   *                          longitude:
   *                            name: Longitude
   *                            type: string
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

  router.post('/step', auth.required, auth.isFarmAdminMedia,async (req,res) => {
    try{

        var medias = []
        var mediaFiles = []

        if(!Array.isArray(req.files.media))
            mediaFiles.push(req.files.media)
        else    
            mediaFiles = req.files.media
        var productId = req.body.product
        var stepId = req.body.step
        
        var geolocal = JSON.parse(req.body.geolocal)
        var loadMedia = mediaFiles.map( async (mediaFile)=> {
            const mediaData = {
                timestamp: geolocal.timestamp,
                location: {
                    longitude: geolocal.coords.longitude,
                    latitude: geolocal.coords.latitude
                }
            }


            var media = await repo.createMedia(mediaData)
            mediaData._id = media._id
            try{
                
                var filename = Date.now()+ '-' + mediaFile.originalFilename
                filename = filename.replace('mp4','MP4')
                var pathname = path.join('/farm',res.locals.farmId.toString(),req.originalUrl, media._id.toString())
                var uploadfile = await storageService.uploadFileInS3(mediaFile.path, filename, pathname )
                media.src= path.join(pathname,filename)
                var smartContract = await blockchainService.createMediaSmartContract()
                media.smartContract = smartContract

                var fileMime = mime.getType(mediaFile.path);
                if(fileMime.includes('video'))
                    media.type='video'
                else
                    media.type='image'

                media.muted = true    
                media.save()
                medias.push(media)

                
            }catch (err) {
                res.status(400).json({msg: err.message})
            }
        })

        Promise.all(loadMedia).then( async ()=>{
            try{
                var updatedProductMedia = await repo.addMediasToProduct(productId,  medias)
                var stepData = {
                    media: medias
                }
                var step = await repo.getStep(productId,stepId)
                step.media.push(...medias)

                var updateStep = await repo.updateStep(productId,stepId,step)
                res.status(status.OK).json(updateStep)



                
            }catch (err) {
                res.status(400).json({msg: err.message})
            }
        })
    } catch (err) {
        res.status(400).json({msg: err.message})
    }

})
     /**
   * @swagger
   * /product/media/{mediaId}/base64:
   *   get:
   *     summary: Get Media Base64
   *     description: Get a media base 64 versione
   *     security:
   *        - bearerAuth: []
   *     tags: [Product]
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: mediaId
   *          in: path
   *          required: true
   *          description: Media id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *     responses:
   *             200:
   *                 content:
   *                     application/json:
   *                        schema:
   *                            type:string
   *             400:
   *                 description: Application error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Media not found
   */

    router.get('/:mediaId/base64', async (req,res) => {
        try{
            var media = await repo.getMedia(req.params.mediaId) 
            if(media){
                var mediaBase64 = await storageService.fileToBase64(media.src)
                res.status(status.OK).json(mediaBase64)
            }else
                res.status(404).json({msg: 'media not found'})
        }catch (err) {
            res.status(400).json({msg: err.message})
        }
    })


    return router;
}