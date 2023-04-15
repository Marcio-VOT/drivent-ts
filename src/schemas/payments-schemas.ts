import { onlyNumbers } from '@brazilian-utils/brazilian-utils';
import Joi from 'joi';

export const ticketIdObjectValidationSchema = Joi.object({
  ticketId: Joi.string().min(1).custom(joiNumberValidation).required(),
});

const cardDataInfo = Joi.object({
  issuer: Joi.string().required(),
  number: Joi.number().required(),
  name: Joi.string().required(),
  expirationDate: Joi.string().required(),
  cvv: Joi.number().required(),
});

export const processPaymentInfo = Joi.object({
  ticketId: Joi.number().required(),
  cardData: cardDataInfo,
});

function joiNumberValidation(value: string, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;

  if (!onlyNumbers(value)) {
    return helpers.error('any.invalid');
  }

  return value;
}
