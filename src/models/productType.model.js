const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose);
const Joi = require('joi');


var joiStepSchema = Joi.object().keys({
    name: Joi.string(),
    icon: Joi.string(),
    status: Joi.string().valid('Current','Next','Completed'),
    order: Joi.number()
})

var joiProductTypeSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string(),
    category: Joi.string().valid('Frutta','Verdura').required(),
    steps: Joi.array().items(joiStepSchema),
})

var mongooseProductTypeSchema = new Mongoose.Schema(Joigoose.convert(joiProductTypeSchema));

module.exports = Mongoose.model('ProductType', mongooseProductTypeSchema);