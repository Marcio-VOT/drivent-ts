import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketType, getTicketsFromUserId, postNewTiket } from '@/controllers';
import { ticketTypeIdValidation } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketType)
  .get('/', getTicketsFromUserId)
  .post('/', validateBody(ticketTypeIdValidation), postNewTiket);

export { ticketsRouter };
