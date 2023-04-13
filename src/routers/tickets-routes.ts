import { Router } from 'express';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', (req, res) => res.sendStatus(401))
  .get('/', (req, res) => res.sendStatus(401))
  .post('/', (req, res) => res.sendStatus(401));

export { ticketsRouter };
