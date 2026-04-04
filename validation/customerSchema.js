import Joi from 'joi'

const customerSchema = Joi.object({
  external_id: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  country_code: Joi.string().required(),
  status_code: Joi.string().required()
});

export default customerSchema;