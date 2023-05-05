import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import { paymentRequired } from '@/errors/payment-required-error';

async function listHotels(userId: number) {
  await validateUserData(userId);

  const hotelList = await hotelsRepository.listHotels();
  if (!hotelList[0]) throw notFoundError();

  return hotelList;
}

async function listHotelRooms(userId: number, hotelId: number) {
  await validateUserData(userId);

  const hotel = await hotelsRepository.findHotel(hotelId);
  if (!hotel) throw notFoundError();

  return await hotelsRepository.listHotelRooms(hotelId);
}

export const hotelsService = {
  listHotels,
  listHotelRooms,
  validateUserData,
};

async function validateUserData(userId: number) {
  const userEnrollment = await ticketRepository.findUserEnrrolment(userId);
  if (!userEnrollment) throw notFoundError();

  const {
    Ticket: [ticket],
  } = await ticketRepository.findUserTickets(userId);
  if (!ticket) throw notFoundError();

  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote || ticket.status !== 'PAID')
    throw paymentRequired();
}
