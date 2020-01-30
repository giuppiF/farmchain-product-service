const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose);
const Joi = require('joi');

 /**
   * @swagger
   * components:
   *  schemas:
   *   ProductMedia:
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
   *         example: 0x000000000
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
    }),
    base64: Joi.string()
})  
  /**
   * @swagger
   * components:
   *  schemas:
   *   ProductStep:
   *     properties:
   *       name:
   *         name: name
   *         description: Step's name
   *         in: formData
   *         required: true
   *         type: string
   *         example: Semina
   *       description:
   *         name: description
   *         description: Step's description
   *         in: formData
   *         required: true
   *         type: string
   *       icon:
   *         name: icon
   *         description: Step's icon
   *         in: formData
   *         required: true
   *         type: string
   *       status:
   *         name: status
   *         description: Step's status
   *         in: formData
   *         required: false
   *         type: string
   *         enum: [Current, Next, Completed]
   *       order:
   *         name: order
   *         description: Step's order
   *         in: formData
   *         required: true
   *         type: string
   *       media:
   *         type: array
   *         items:
   *         $ref: '#/components/schemas/ProductMedia'
   *       date:
   *         name: date
   *         description: Step's date
   *         in: formData
   *         required: true
   *         type: string
   */
var joiStepSchema = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string().allow(''),
    icon: Joi.string(),
    status: Joi.string().valid('Current','Next','Completed'),
    order: Joi.number(),
    media: Joi.array().items(joiMediaSchema),
    date: Joi.number()
})
  /**
   * @swagger
   * components:
   *  schemas:
   *   ProductExtra:
   *     properties:
   *       title:
   *         name: name
   *         description: Extra's title
   *         in: formData
   *         required: true
   *         type: string
   *         example: Extra
   *       image:
   *         name: image
   *         description: Extra's image
   *         in: formData
   *         required: false
   *         type: string
   *         format: binary
   *       content:
   *         name: icon
   *         description: Extra's content
   *         in: formData
   *         required: true
   *         type: string
   *       type:
   *         name: type
   *         description: Step's type
   *         in: formData
   *         required: false
   *         type: string
   *         enum: [Recipe, Pairing, Advice]
   *       status:
   *         name: status
   *         description: Step's status
   *         in: formData
   *         required: false
   *         type: string
   *         enum: [draft, published]
   */
const joiExtraSchema = Joi.object().keys({
    title: Joi.string(),
    image:  Joi.string(),
    content: Joi.string(),
    type: Joi.string().valid("Recipe","Pairing","Advice"),
    status: Joi.string().valid("draft","published")
})
 /**
   * @swagger
   * components:
   *  schemas:
   *   ProductDealer:
   *     properties:
   *       name:
   *         name: name
   *         description: Dealer's name
   *         in: formData
   *         required: true
   *         type: string
   *         example: Il bel distributore
   *       address:
   *         name: address
   *         description: Dealer's address
   *         in: formData
   *         required: true
   *         type: string
   *         example: Via Roma 10 - 10100  Torino
   *       mail:
   *         name: mail
   *         description: Dealer's mail
   *         in: formData
   *         required: true
   *         type: string
   *         format: email
   *         example: mail@mail.it
   *       phone:
   *         name: phone
   *         description: Dealer's phone
   *         in: formData
   *         required: true
   *         type: string
   *         example: 333 1223321
   *       image:
   *         name: image
   *         description: Dealer's logo
   *         in: formData
   *         required: false
   *         type: string
   *         format: binary
   *       site:
   *         name: site
   *         description: Dealer's website URL
   *         in: formData
   *         required: false
   *         type: string
   */
var joiDealerSchema = Joi.object().keys({
    name: Joi.string(),
    address: Joi.string(),
    phone: Joi.string().allow(''),
    mail: Joi.string().allow(''),
    site: Joi.string().allow(''),
    image:  Joi.string(),
});

 /**
   * @swagger
   * components:
   *  schemas:
   *   ProductLot:
   *     properties:
   *       name:
   *           name: name
   *           description: Lot's name
   *           in: formData
   *           required: true
   *           type: string
   *           example: Lotto
   *       description:
   *           name: description
   *           description: Lot's description
   *           in: formData
   *           required: false
   *           type: string
   *       image:
   *           name: image
   *           description: Lot's image
   *           in: formData
   *           required: false
   *           type: string
   *           format: binary
   */

const joiLotSchema = Joi.object().keys({
    name: Joi.string(),
    image: Joi.string(),
    description: Joi.string(),
})
  /**
   * @swagger
   * components:
   *  schemas:
   *   ProductRaw:
   *     properties:
   *       name:
   *         name: name
   *         description: Raw's name
   *         in: formData
   *         required: true
   *         type: string
   *         example: Pomodoro
   *       description:
   *         name: description
   *         description: Raw's description
   *         in: formData
   *         required: true
   *         type: string
   *       image:
   *         name: image
   *         description: Raw's image
   *         in: formData
   *         required: true
   *         type: binary
   *       expiration:
   *         name: expiration
   *         description: Raw's status
   *         in: formData
   *         required: false
   *         type: string
   *         enum: [Current, Next, Completed]
   *       smartContract:
   *         name: smartContract
   *         description: Raw's smartContract address
   *         in: formData
   *         required: true
   *         type: string
   *       steps:
   *         type: array
   *         items:
   *         $ref: '#/components/schemas/ProductStep'
   */
var joiRawProductSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    image: Joi.string(),
    expiration: Joi.string(),
    smartContract: Joi.string(),
    steps: Joi.array().items(joiStepSchema)
})
 /**
   * @swagger
   * components:
   *  schemas:
   *   Product:
   *     required:
   *        - name
   *        - description
   *        - image
   *        - createdAt
   *        - updatedAt
   *        - farm
   *     properties:
   *       name:
   *         name: name
   *         description: Product's name
   *         in: formData
   *         required: true
   *         type: string
   *         example: Il bel prodotto
   *       description:
   *         name: description
   *         description: Product's description
   *         in: formData
   *         required: true
   *         type: string
   *         example: Molto bello
   *       image:
   *         name: image
   *         description: Product's image
   *         in: formData
   *         required: false
   *         type: string
   *         format: binary
   *       createdAt:
   *         name: createdAt
   *         description: Product's createdAt
   *         in: formData
   *         required: false
   *         type: string
   *       updatedAt:
   *         name: updatedAt
   *         description: Product's updatedAt
   *         in: formData
   *         required: false
   *         type: string
   *       farm:
   *         name: farm
   *         description: Product's farm
   *         in: formData
   *         required: true
   *         type: object
   *         properties:
   *            _id:
   *                name: _id
   *                description: Farm id
   *                in: formData
   *                required: false
   *                type: string
   *            description:
   *                name: description
   *                description: Farm description
   *                in: formData
   *                required: false
   *                type: string
   *            logo:
   *                name: logo
   *                description: Farm logo
   *                in: formData
   *                required: false
   *                type: string
   *            address:
   *                name: address
   *                description: Farm's address
   *                in: formData
   *                required: true
   *                type: string
   *                example: Via Roma 10 - 10100  Torino
   *            mail:
   *                name: mail
   *                description: Farm's mail
   *                in: formData
   *                required: true
   *                type: string
   *                format: email
   *                example: mail@mail.it
   *            phone:
   *                name: phone
   *                description: Farm's phone
   *                in: formData
   *                required: true
   *                type: string
   *                example: 333 1223321
   *            websiteURL:
   *                name: websiteURL
   *                description: Farm's website URL
   *                in: formData
   *                required: false
   *                type: string
   *       expiration:
   *         name: expiration
   *         description: Product's expiration
   *         in: formData
   *         required: false
   *         type: string
   *       labelUrl:
   *         name: labelUrl
   *         description: Product's label URL
   *         in: formData
   *         required: false
   *         type: string
   *       qrcode:
   *         name: qrcode
   *         description: Product's QR code
   *         in: formData
   *         required: true
   *         type: object
   *         properties:
   *            src:
   *                name: src
   *                description: QR code src
   *                in: formData
   *                required: false
   *                type: string
   *            base64:
   *                name: base64
   *                description: QR code base 64
   *                in: formData
   *                required: false
   *                type: string
   *       status:
   *         name: site
   *         description: Product's status
   *         in: formData
   *         required: false
   *         type: string
   *         enum: [In Progress, Completed]
   *       category:
   *         name: category
   *         description: Product's category
   *         in: formData
   *         required: true
   *         type: string
   *         enum: [Frutta, Verdura]
   *         example: Frutta
   *       smartContract:
   *         name: smartContract
   *         description: Product's smart contract address
   *         in: formData
   *         required: false
   *         type: string
   *       steps:
   *         type: array
   *         items:
   *         $ref: '#/components/schemas/ProductStep'
   *       extras:
   *         type: array
   *         items:
   *         $ref: '#/components/schemas/ProductExtra'
   *       dealers:
   *         type: array
   *         items:
   *         $ref: '#/components/schemas/ProductDealer'
   *       media:
   *         type: array
   *         items:
   *         $ref: '#/components/schemas/ProductMedia'
   *       lots:
   *         type: array
   *         items:
   *         $ref: '#/components/schemas/ProductLot'
   *       flyer:
   *         name: flyer
   *         description: Product's flyer
   *         in: formData
   *         required: false
   *         type: string
   *       rawProducts:
   *         type: array
   *         items:
   *         $ref: '#/components/schemas/ProductRaw'
   */
var joiProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('').allow(null),
    image: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    farm: Joi.object().keys({
        _id: Joi.string(),
        name: Joi.string().required(),
        address: Joi.string().required(),
        mail: Joi.string().email().required(),
        phone: Joi.string().required(),
        logo: Joi.string().allow(''),
        websiteURL: Joi.string().allow('').allow(null),
        description: Joi.string().allow('').allow(null),
    }),
    expiration: Joi.string().allow('').allow(null),
    labelUrl: Joi.string().allow('').allow(null),
    qrcode: Joi.object().keys({
        src: Joi.string().allow(''),
        base64: Joi.string().allow('')
    }),
    status: Joi.string().valid('In Progress','Completed'),
    category: Joi.string().valid('Frutta','Verdura').required(),
    smartContract: Joi.string().allow('').allow(null),
    steps: Joi.array().items(joiStepSchema),
    extras: Joi.array().items(joiExtraSchema),
    dealers: Joi.array().items(joiDealerSchema),
    media: Joi.array().items(joiMediaSchema),
    lots: Joi.array().items(joiLotSchema),
    flyer: Joi.string().allow(''),
    rawProducts: Joi.array().items(joiRawProductSchema)
})

var mongooseProductSchema = new Mongoose.Schema(Joigoose.convert(joiProductSchema));

module.exports = Mongoose.model('Product', mongooseProductSchema);