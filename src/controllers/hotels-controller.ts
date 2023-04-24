import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotesService } from '@/services';

export async function getHotelList(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const hotels = await hotesService.listHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    next(error);
  }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { hotelId } = req.params;

  try {
    const rooms = await hotesService.listHotelRooms(userId, Number(hotelId));
    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    next(error);
  }
}
