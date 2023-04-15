import { AuthenticatedRequest } from '@/middlewares';
import { ticketService } from '@/services/tickets-service';
import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';

export async function getTicketType(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const ticketTypes = await ticketService.listTicketTypes();
    res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    next(error);
  }
}

export async function getTicketsFromUserId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const userTickets = await ticketService.listUserTickets(userId);
    res.status(httpStatus.OK).send(userTickets);
  } catch (error) {
    next(error);
  }
}

export async function postNewTiket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { ticketTypeId } = req.body as { ticketTypeId: number };

  try {
    const result = await ticketService.createNewTicket({ userId, ticketTypeId });
    res.status(httpStatus.CREATED).send(result);
  } catch (error) {
    next(error);
  }
}
