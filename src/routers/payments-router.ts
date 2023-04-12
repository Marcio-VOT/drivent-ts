import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', (req, res) => res.sendStatus(401))
  .post('/process', (req, res) => res.sendStatus(401));

export { paymentsRouter };
