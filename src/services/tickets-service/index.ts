import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';

async function listTicketTypes() {
  return await ticketRepository.selectAllTicketTypes();
}

async function listUserTickets(userId: number) {
  const userEnrollment = await ticketRepository.findUserEnrrolment(userId);
  if (!userEnrollment) throw notFoundError();

  const { Ticket } = await ticketRepository.findUserTickets(userId);
  if (!Ticket[0]) throw notFoundError();

  return Ticket[0];
}

async function createNewTicket({ userId, ticketTypeId }: { userId: number; ticketTypeId: number }) {
  const enrollment = await ticketRepository.findUserEnrrolment(userId);

  if (!enrollment) throw notFoundError();

  return await ticketRepository.createNewTicket({ ticketTypeId, enrollmentId: enrollment.id });
}

export const ticketService = {
  listTicketTypes,
  listUserTickets,
  createNewTicket,
};
