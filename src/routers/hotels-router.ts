import { Router } from 'express';
import { authenticateToken, validateParams } from '@/middlewares';
import { hotelIdObjectValidationSchema } from '@/schemas/hotels-schemas';
import { getHotelList, getHotelRooms } from '@/controllers/hotels-controller';

const hotelsRoutes = Router();

hotelsRoutes
  .all('/*', authenticateToken)
  .get('/', getHotelList)
  .get('/:hotelId', validateParams(hotelIdObjectValidationSchema), getHotelRooms);

export { hotelsRoutes };
