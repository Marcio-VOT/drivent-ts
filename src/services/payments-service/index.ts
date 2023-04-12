import { notFoundError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';

async function getTicketPaymentInfo({ ticketId, userId }: { ticketId: string; userId: number }) {
  const ticketInfo = await paymentRepository.findFirst(ticketId);
  const {
    Ticket: [UserTiket],
  } = await paymentRepository.findTicketOwner({ ticketId, userId });

  const allTickets = await paymentRepository.findAll();

  console.log(ticketInfo, userId, UserTiket, allTickets);

  if (!ticketInfo || !allTickets[0]) throw notFoundError();

  if (!UserTiket) throw unauthorizedError();

  return ticketInfo;
}

const paymentService = {
  getTicketPaymentInfo,
};

export default paymentService;
