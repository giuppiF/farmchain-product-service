const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose);
const Joi = require('joi');

var joiMediaSchema = Joi.object().keys({
    src: Joi.string(),
    smartContract: Joi.string(),
    date: Joi.date(),
    location: Joi.string()
})



var mongooseMediaSchema = new Mongoose.Schema(Joigoose.convert(joiMediaSchema));

module.exports = Mongoose.model('Media', mongooseMediaSchema);