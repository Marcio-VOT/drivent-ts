import { notFoundError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';

async function getTicketPaymentInfo({ ticketId, userId }: { ticketId: string; userId: number }) {
  const ticket = await paymentRepository.findTicket(ticketId);
  // console.log({ userId, UserTiket, allTickets, ticketId });

  if (!ticket) throw notFoundError();

  const {
    Ticket: [UserTiket],
  } = await paymentRepository.findTicketOwner({ ticketId, userId });

  if (!UserTiket) throw unauthorizedError();

  const ticketInfo = await paymentRepository.findFirst(ticketId);

  return ticketInfo;
}

export const paymentService = {
  getTicketPaymentInfo,
};
