import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  CONNECTION_STRING: Joi.string().required(),
});
