const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose);
const Joi = require('joi');
 /**
   * @swagger
   * components:
   *  schemas:
   *   Media:
   *     properties:
   *       src:
   *         name: src
   *         description: Media src
   *         in: formData
   *         required: true
   *         type: string
   *         example: /media/23423425
   *       smartContract:
   *         name: smartContract
   *         description: Media smart contract address
   *         in: formData
   *         required: true
   *         type: string
   *         example: 0x000000000
   *       timestamp:
   *         name: timestamp
   *         description: Media timestamp
   *         in: formData
   *         required: true
   *         type: string
   *         example: 2312312323
   *       type:
   *         name: type
   *         description: Media type
   *         in: formData
   *         required: true
   *         type: string
   *         example: video
   *       thumbnail:
   *         name: type
   *         description: Media thumbnail
   *         in: formData
   *         required: true
   *         type: string
   *         example: video
   *       location:
   *         name: location
   *         description: Media location
   *         in: formData
   *         required: true
   *         type: object
   *         properties:
   *            longitude:
   *                name: longitude
   *                description: Media longitude
   *                in: formData
   *                required: false
   *                type: string
   *            latitude:
   *                name: latitude
   *                description: Media latitude
   *                in: formData
   *                required: false
   *                type: string
   *       base64:
   *         name: base64
   *         description: Media base64
   *         in: formData
   *         required: true
   *         type: string
   *         example: 2312312323
   *            
   */

var joiMediaSchema = Joi.object().keys({
    src: Joi.string(),
    smartContract: Joi.string(),
    timestamp: Joi.number(),
    type: Joi.string().valid('video','img'),
    thumbnail: Joi.string(),
    location: Joi.object().keys({
        longitude: Joi.number(),
        latitude: Joi.number()
    })
})



var mongooseMediaSchema = new Mongoose.Schema(Joigoose.convert(joiMediaSchema));

module.exports = Mongoose.model('Media', mongooseMediaSchema);