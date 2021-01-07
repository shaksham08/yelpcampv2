const Joi = require("joi");
const campgroundsSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    url: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

module.exports = campgroundsSchema;
