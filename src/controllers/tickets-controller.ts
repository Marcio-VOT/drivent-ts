import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getTicketType(req: Request, res: Response, next: NextFunction) {
  //   const { userId } = req;
  try {
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    next(error);
  }
}

export async function getTicketsFromUserId(req: Request, res: Response, next: NextFunction) {
  //   const { userId } = req;
  try {
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    next(error);
  }
}

export async function postNewTiket(req: Request, res: Response, next: NextFunction) {
  //   const { userId } = req;

  try {
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    next(error);
  }
}
