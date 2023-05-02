import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';
import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';

export async function userBookingData(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const booking = bookingService.userBookingData(userId);
    return res.sendStatus(httpStatus.OK).send(booking);
  } catch (e) {
    next(e);
  }
}

export async function registerNewBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { roomId } = req.body;
  try {
    const bookingId = bookingService.registerNewBooking(userId, roomId);
    return res.sendStatus(httpStatus.OK).send(bookingId);
  } catch (e) {
    next(e);
  }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { roomId } = req.body;
  let { bookingId: bId } = req.params;
  try {
    const bookingId = await bookingService.changeBookingRoom(userId, roomId, Number(bId));
    return res.sendStatus(httpStatus.OK).send(bookingId);
  } catch (e) {
    next(e);
  }
}
