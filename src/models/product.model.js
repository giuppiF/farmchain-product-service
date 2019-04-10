const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose);
const Joi = require('joi');

var joiMediaSchema = Joi.object().keys({
    src: Joi.string(),
    smartContract: Joi.string(),
    timestamp: Joi.number(),
    location: Joi.object().keys({
        longitude: Joi.number(),
        latitude: Joi.number()
    }),
    base64: Joi.string()
})  

var joiStepSchema = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string().allow(''),
    icon: Joi.string(),
    status: Joi.string().valid('Current','Next','Completed'),
    order: Joi.number(),
    media: Joi.array().items(joiMediaSchema),
    date: Joi.number()
})

const joiExtraSchema = Joi.object().keys({
    title: Joi.string(),
    image:  Joi.string(),
    content: Joi.string(),
    type: Joi.string().valid("Recipe","Pairing","Advice"),
    status: Joi.string().valid("draft","published")
})

var joiDealerSchema = Joi.object().keys({
    name: Joi.string(),
    address: Joi.string(),
    phone: Joi.string().allow(''),
    mail: Joi.string().allow(''),
    site: Joi.string().allow(''),
    image:  Joi.string(),
});


const joiLotSchema = Joi.object().keys({
    name: Joi.string(),
    image: Joi.string(),
    description: Joi.string(),
})

var joiRawProductSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    image: Joi.string(),
    expiration: Joi.string(),
    smartContract: Joi.string(),
    steps: Joi.array().items(joiStepSchema)
})

var joiProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    image: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    farm: Joi.object().keys({
        _id: Joi.string(),
        name: Joi.string().required(),
        address: Joi.string().required(),
        mail: Joi.string().email().required(),
        phone: Joi.string().required(),
        logo: Joi.string(),
        websiteURL: Joi.string(),
        description: Joi.string(),
    }),
    expiration: Joi.string(),
    labelUrl: Joi.string().allow(''),
    qrcode: Joi.object().keys({
        src: Joi.string().allow(''),
        base64: Joi.string().allow('')
    }),
    status: Joi.string().valid('In Progress','Completed'),
    category: Joi.string().valid('Frutta','Verdura').required(),
    smartContract: Joi.string(),
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