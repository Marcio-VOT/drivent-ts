import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getTicketPaymentInfo(req: Request, res: Response, next: NextFunction) {
  //   const { userId } = req;
  try {
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    next(error);
  }
}

export async function postTicketPayment(req: Request, res: Response, next: NextFunction) {
  //   const { userId } = req;

  try {
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    next(error);
  }
}
