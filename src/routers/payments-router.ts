import { getTicketPaymentInfo, postTicketPayment } from '@/controllers';
import { authenticateToken, validateQuery } from '@/middlewares';
import { ticketIdObjectValidationSchema } from '@/schemas/payments-schemas';
import { Router } from 'express';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', validateQuery(ticketIdObjectValidationSchema), getTicketPaymentInfo)
  .post('/process', postTicketPayment);

export { paymentsRouter };
