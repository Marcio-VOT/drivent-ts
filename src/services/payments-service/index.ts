import { notFoundError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';

async function getTicketPaymentInfo({ ticketId, userId }: { ticketId: string; userId: number }) {
  const ticketInfo = await paymentRepository.findFirst(ticketId);

  if (!ticketInfo[0]) {
    throw notFoundError();
  }

  const {
    Enrollment: [UserTicket],
  } = await paymentRepository.findTicketOwner({ ticketId, userId });

  if (!UserTicket.Ticket[0]) {
    throw unauthorizedError();
  }

  return ticketInfo[0];
}

const paymentService = {
  getTicketPaymentInfo,
};

export default paymentService;
