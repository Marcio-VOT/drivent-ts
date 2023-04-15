import { notFoundError, unauthorizedError } from '@/errors';
import { TicketPaymentUserData } from '@/protocols';
import paymentRepository, { TicketPaymentInfo } from '@/repositories/payment-repository';

async function getTicketPaymentInfo({ ticketId, userId }: { ticketId: string; userId: number }) {
  const ticket = await paymentRepository.findTicket(ticketId);
  if (!ticket) throw notFoundError();

  const {
    Ticket: [UserTiket],
  } = await paymentRepository.findTicketOwner({ ticketId, userId });
  if (!UserTiket) throw unauthorizedError();

  const ticketInfo = await paymentRepository.findFirst(ticketId);

  return ticketInfo;
}

async function postTicketPayment(
  { ticketId, cardData: { issuer, number, name, expirationDate, cvv } }: TicketPaymentUserData,
  userId: number,
) {
  const ticket = await paymentRepository.findTicket(ticketId.toString());
  if (!ticket) throw notFoundError();

  const {
    Ticket: [UserTiket],
  } = await paymentRepository.findTicketOwner({ ticketId: ticketId.toString(), userId });
  if (!UserTiket) throw unauthorizedError();

  const ticketType = await paymentRepository.findTicketType(ticket.ticketTypeId);

  const paymentInfo = await paymentRepository.makeTicketPayment({
    ticketId,
    value: ticketType.price,
    cardIssuer: issuer,
    cardLastDigits: number.toString().slice(-4),
  });

  await paymentRepository.updateTciketPaymentStatus(ticketId.toString());

  return paymentInfo;
}

export const paymentService = {
  getTicketPaymentInfo,
  postTicketPayment,
};
