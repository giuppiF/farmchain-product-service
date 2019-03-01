const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose);
const Joi = require('joi');

var joiMediaSchema = Joi.object().keys({
    src: Joi.string(),
    smartContract: Joi.string(),
    timestamp: Joi.date().timestamp(),
    location: Joi.object().keys({
        longitude: Joi.number(),
        latitude: Joi.number()
    })
})



var mongooseMediaSchema = new Mongoose.Schema(Joigoose.convert(joiMediaSchema));

module.exports = Mongoose.model('Media', mongooseMediaSchema);