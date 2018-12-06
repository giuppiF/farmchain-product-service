const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose);
const Joi = require('joi');

var joiMediaSchema = Joi.object().keys({
    src: Joi.string(),
    smartContract: Joi.string(),
    date: Joi.date(),
    location: Joi.string()
})

var joiStepSchema = Joi.object().keys({
    name: Joi.string(),
    icon: Joi.string(),
    status: Joi.string().valid('New','In Progress','Completed'),
    order: Joi.string(),
    media: Joi.array().items(joiMediaSchema)
});

var joiExtraSchema = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),

})

var joiDealerSchema = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    
})



var joiProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    category: Joi.string().valid('Frutta','Verdura').required(),
    smartContract: Joi.string().required(),
    steps: Joi.array().items(joiStepSchema),
    extras: Joi.array().items(joiExtraSchema),
    dealers: Joi.array().items(joiDealerSchema),
    media: Joi.array().items(joiMediaSchema)
});

var mongooseProductSchema = new Mongoose.Schema(Joigoose.convert(joiProductSchema));

module.exports = Mongoose.model('Product', mongooseProductSchema);