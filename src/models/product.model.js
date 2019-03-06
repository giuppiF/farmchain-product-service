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
    })
})

var joiStepSchema = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    icon: Joi.string(),
    status: Joi.string().valid('Current','Next','Completed'),
    order: Joi.number(),
    media: Joi.array().items(joiMediaSchema)
})

var joiExtraSchema = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    image: Joi.string()
})

var joiDealerSchema = Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string(),
    phone: Joi.string(),
    mail: Joi.string(),
    site: Joi.string(),
    image:  Joi.string().required(),
});


const joiLotSchema = Joi.object().keys({
    name: Joi.string(),
    image: Joi.string(),
    description: Joi.string(),
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
    status: Joi.string().valid('In Progress','Completed'),
    category: Joi.string().valid('Frutta','Verdura').required(),
    smartContract: Joi.string(),
    steps: Joi.array().items(joiStepSchema),
    extras: Joi.array().items(joiExtraSchema),
    dealers: Joi.array().items(joiDealerSchema),
    media: Joi.array().items(joiMediaSchema),
    lots: Joi.array().items(joiLotSchema),
})

var mongooseProductSchema = new Mongoose.Schema(Joigoose.convert(joiProductSchema));

module.exports = Mongoose.model('Product', mongooseProductSchema);