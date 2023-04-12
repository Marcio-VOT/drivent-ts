import { getTicketPaymentInfo, postTicketPayment } from '@/controllers';
import { authenticateToken, validateQuery } from '@/middlewares';
import { idObjectValidationSchema } from '@/schemas/payments-schemas';
import { Router } from 'express';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', validateQuery(idObjectValidationSchema), getTicketPaymentInfo)
  .post('/process', postTicketPayment);

export { paymentsRouter };
