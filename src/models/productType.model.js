const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose);
const Joi = require('joi');

  /**
   * @swagger
   * components:
   *  schemas:
   *   ProductTypeStep:
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
   */
var joiStepSchema = Joi.object().keys({
    name: Joi.string(),
    icon: Joi.string(),
    description: Joi.string().allow(''),
    status: Joi.string().valid('Current','Next','Completed'),
    order: Joi.number()
})
  /**
   * @swagger
   * components:
   *  schemas:
   *   ProductType:
   *     properties:
   *       name:
   *         name: name
   *         description: ProductType's name
   *         in: formData
   *         required: true
   *         type: string
   *         example: Pomodoro
   *       image:
   *         name: image
   *         description: ProductType's image
   *         in: formData
   *         required: true
   *         type: binary
   *       category:
   *         name: category
   *         description: ProductType's status
   *         in: formData
   *         required: false
   *         type: string
   *         enum: [Frutta, verdura]
   *       steps:
   *         type: array
   *         items:
   *         $ref: '#/components/schemas/ProductTypeStep'
   */
var joiProductTypeSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string(),
    category: Joi.string().valid('Frutta','Verdura').required(),
    steps: Joi.array().items(joiStepSchema),
})

var mongooseProductTypeSchema = new Mongoose.Schema(Joigoose.convert(joiProductTypeSchema));

module.exports = Mongoose.model('ProductType', mongooseProductTypeSchema);