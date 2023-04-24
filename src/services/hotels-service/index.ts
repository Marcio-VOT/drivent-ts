import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import { paymentRequired } from '@/errors/payment-required-error';
import paymentRepository from '@/repositories/payment-repository';

async function listHotels(userId: number) {
  const hotelList = await hotelsRepository.listHotels();
  if (!hotelList[0]) throw notFoundError();

  const userEnrollment = await ticketRepository.findUserEnrrolment(userId);
  if (!userEnrollment) throw notFoundError();

  const {
    Ticket: [ticket],
  } = await ticketRepository.findUserTickets(userId);
  if (!ticket) throw notFoundError();

  const payment = await paymentRepository.findFirst(String(ticket.id));

  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote || !payment) throw paymentRequired();

  return hotelList;
}

async function listHotelRooms(userId: number, hotelId: number) {
  const userEnrollment = await ticketRepository.findUserEnrrolment(userId);
  if (!userEnrollment) throw notFoundError();

  const {
    Ticket: [ticket],
  } = await ticketRepository.findUserTickets(userId);
  if (!ticket) throw notFoundError();

  const payment = await paymentRepository.findFirst(String(ticket.id));

  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote || !payment) throw paymentRequired();

  const hotel = await hotelsRepository.findHotel(hotelId);
  if (!hotel) throw notFoundError();

  return await hotelsRepository.listHotelRooms(hotelId);
}

export const hotesService = {
  listHotels,
  listHotelRooms,
};
