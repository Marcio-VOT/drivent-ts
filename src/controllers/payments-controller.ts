import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { paymentService } from '@/services/payments-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketPaymentInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { ticketId } = req.query as Record<string, string>;
  try {
    const ticketInfo = await paymentService.getTicketPaymentInfo({ ticketId, userId });
    res.status(httpStatus.OK).send(ticketInfo);
  } catch (error) {
    next(error);
  }
}

export async function postTicketPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    next(error);
  }
}
