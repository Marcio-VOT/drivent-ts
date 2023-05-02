import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { userBookingData, registerNewBooking, changeBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', userBookingData)
  .post('/', registerNewBooking)
  .put('/:bookingId', changeBooking);

export { bookingRouter };
