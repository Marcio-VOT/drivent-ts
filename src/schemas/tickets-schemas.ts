import Joi from 'joi';

export const ticketTypeIdValidation = Joi.object({
  ticketTypeId: Joi.number().required(),
});
