import { onlyNumbers } from '@brazilian-utils/brazilian-utils';
import Joi from 'joi';

export const idObjectValidationSchema = Joi.object({
  ticketId: Joi.string().min(1).custom(joiNumberValidation).required(),
});

function joiNumberValidation(value: string, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;

  if (!onlyNumbers(value)) {
    return helpers.error('any.invalid');
  }

  return value;
}
