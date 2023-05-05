import { invalidAccessError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function userBookingData(userId: number) {
  const bookingData = await bookingRepository.userBookingData(userId);
  if (!bookingData) throw notFoundError();
  return bookingData;
}

async function registerNewBooking(userId: number, roomId: number) {
  const room = await validateUserData(userId, roomId);

  const booking = await bookingRepository.upsertBooking(userId, room.id);
  return booking.id;
}

async function changeBookingRoom(userId: number, roomId: number, bookingId: number) {
  const room = await validateUserData(userId, roomId);

  const bookingData = await bookingRepository.userBookingData(userId);
  if (!bookingData) throw invalidAccessError();

  const booking = await bookingRepository.upsertBooking(userId, room.id, bookingId);
  return booking.id;
}

async function validateUserData(userId: number, roomId: number) {
  const room = await bookingRepository.findRoom(roomId);
  if (!room) throw notFoundError();

  const userEnrollment = await ticketRepository.findUserEnrrolment(userId);
  if (!userEnrollment) throw notFoundError();

  const {
    Ticket: [ticket],
  } = await ticketRepository.findUserTickets(userId);
  if (!ticket || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote || ticket.status !== 'PAID')
    throw invalidAccessError();

  const bookedRoom = await bookingRepository.findBookedRoom(roomId);
  if (bookedRoom) throw invalidAccessError();

  return room;
}

const bookingService = {
  userBookingData,
  registerNewBooking,
  changeBookingRoom,
  validateUserData,
};

export default bookingService;
