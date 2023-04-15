import { Router } from 'express';
import { getTicketPaymentInfo, postTicketPayment } from '@/controllers';
import { authenticateToken, validateBody, validateQuery } from '@/middlewares';
import { processPaymentInfo, ticketIdObjectValidationSchema } from '@/schemas/payments-schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', validateQuery(ticketIdObjectValidationSchema), getTicketPaymentInfo)
  .post('/process', validateBody(processPaymentInfo), postTicketPayment);

export { paymentsRouter };
