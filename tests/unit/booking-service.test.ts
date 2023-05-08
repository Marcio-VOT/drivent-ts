import bookingService from '@/services/booking-service';
import faker from '@faker-js/faker';
import bookingRepository from '@/repositories/booking-repository';
import ticketRepository from '@/repositories/ticket-repository';

describe('service booking test', () => {
  describe('userBookingData test', () => {
    it('should return 404 error if user booking data not found', async () => {
      const userId = faker.datatype.number();
      jest.spyOn(bookingRepository, 'userBookingData').mockImplementationOnce((): any => null);
      const result = bookingService.userBookingData(userId);

      expect(result).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
    it('should return user booking data', async () => {
      const userId = faker.datatype.number();
      jest.spyOn(bookingRepository, 'userBookingData').mockImplementationOnce((): any => true);
      const result = await bookingService.userBookingData(userId);

      expect(result).toEqual(true);
    });
  });
  describe('registerNewBooking test', () => {
    it('shoud respond with the booking id when given valid data', async () => {
      const fakerNumber = faker.datatype.number();
      mockValidateUserData(fakerNumber);
      jest.spyOn(bookingRepository, 'upsertBooking').mockImplementationOnce((): any => ({
        id: fakerNumber,
      }));

      const response = await bookingService.registerNewBooking(fakerNumber, fakerNumber);
      expect(response).toEqual(fakerNumber);
    });
  });
  describe('changeBookingRoom test', () => {
    it('should respond with invalidAccess error when no bookin data found', () => {
      const fakerNumber = faker.datatype.number();
      mockValidateUserData(fakerNumber);
      jest.spyOn(bookingRepository, 'userBookingData').mockImplementationOnce((): any => null);
      const response = bookingService.changeBookingRoom(fakerNumber, fakerNumber, fakerNumber);
      expect(response).rejects.toEqual({ name: 'InvalidAccessError', message: `You can't complete this action` });
    });
    it('should respond with booking id when given valid data', async () => {
      const fakerNumber = faker.datatype.number();
      mockValidateUserData(fakerNumber);
      jest.spyOn(bookingRepository, 'userBookingData').mockImplementationOnce((): any => true);
      jest.spyOn(bookingRepository, 'upsertBooking').mockImplementationOnce((): any => ({ id: fakerNumber }));
      const response = await bookingService.changeBookingRoom(fakerNumber, fakerNumber, fakerNumber);
      expect(response).toEqual(fakerNumber);
    });
  });
  describe('validateUserData test', () => {
    it('should respond with notFoundError when the room dont exist', () => {
      jest.spyOn(bookingRepository, 'findRoom').mockImplementationOnce((): any => false);

      const response = bookingService.validateUserData(faker.datatype.number(), faker.datatype.number());

      expect(response).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
    it('should respond with notFoundError when the user has no enrollment', () => {
      jest.spyOn(bookingRepository, 'findRoom').mockImplementationOnce((): any => ({ id: faker.datatype.number() }));
      jest.spyOn(ticketRepository, 'findUserEnrrolment').mockImplementationOnce((): any => false);

      const response = bookingService.validateUserData(faker.datatype.number(), faker.datatype.number());

      expect(response).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
    it('should respond with invalidAccessError when ticket does not exist', () => {
      jest.spyOn(bookingRepository, 'findRoom').mockImplementationOnce((): any => ({ id: faker.datatype.number() }));
      jest.spyOn(ticketRepository, 'findUserEnrrolment').mockImplementationOnce((): any => true);
      jest.spyOn(ticketRepository, 'findUserTickets').mockImplementationOnce((): any => ({
        Ticket: [null],
      }));

      const response = bookingService.validateUserData(faker.datatype.number(), faker.datatype.number());

      expect(response).rejects.toEqual({
        name: 'InvalidAccessError',
        message: `You can't complete this action`,
      });
    });
    it('should respond with invalidAccessError when ticket type does not iclude hotel', () => {
      jest.spyOn(bookingRepository, 'findRoom').mockImplementationOnce((): any => ({ id: faker.datatype.number() }));
      jest.spyOn(ticketRepository, 'findUserEnrrolment').mockImplementationOnce((): any => true);
      jest.spyOn(ticketRepository, 'findUserTickets').mockImplementationOnce((): any => ({
        Ticket: [{ TicketType: { includesHotel: false, isRemote: false }, status: 'PAID' }],
      }));

      const response = bookingService.validateUserData(faker.datatype.number(), faker.datatype.number());

      expect(response).rejects.toEqual({
        name: 'InvalidAccessError',
        message: `You can't complete this action`,
      });
    });
    it('should respond with invalidAccessError when the ticket type is remote', () => {
      jest.spyOn(bookingRepository, 'findRoom').mockImplementationOnce((): any => ({ id: faker.datatype.number() }));
      jest.spyOn(ticketRepository, 'findUserEnrrolment').mockImplementationOnce((): any => true);
      jest.spyOn(ticketRepository, 'findUserTickets').mockImplementationOnce((): any => ({
        Ticket: [{ TicketType: { includesHotel: true, isRemote: true }, status: 'PAID' }],
      }));

      const response = bookingService.validateUserData(faker.datatype.number(), faker.datatype.number());

      expect(response).rejects.toEqual({
        name: 'InvalidAccessError',
        message: `You can't complete this action`,
      });
    });
    it('should respond with invalidAccessError when the ticket status is not PAID', () => {
      jest.spyOn(bookingRepository, 'findRoom').mockImplementationOnce((): any => ({ id: faker.datatype.number() }));
      jest.spyOn(ticketRepository, 'findUserEnrrolment').mockImplementationOnce((): any => true);
      jest.spyOn(ticketRepository, 'findUserTickets').mockImplementationOnce((): any => ({
        Ticket: [{ TicketType: { includesHotel: true, isRemote: false }, status: 'xxxx' }],
      }));

      const response = bookingService.validateUserData(faker.datatype.number(), faker.datatype.number());

      expect(response).rejects.toEqual({
        name: 'InvalidAccessError',
        message: `You can't complete this action`,
      });
    });
    it('should respond with invalidAccessError when the room is already booked', () => {
      jest.spyOn(bookingRepository, 'findRoom').mockImplementationOnce((): any => ({ id: faker.datatype.number() }));
      jest.spyOn(ticketRepository, 'findUserEnrrolment').mockImplementationOnce((): any => true);
      jest.spyOn(ticketRepository, 'findUserTickets').mockImplementationOnce((): any => ({
        Ticket: [{ TicketType: { includesHotel: true, isRemote: false }, status: 'PAID' }],
      }));
      jest.spyOn(bookingRepository, 'findBookedRoom').mockImplementationOnce((): any => true);

      const response = bookingService.validateUserData(faker.datatype.number(), faker.datatype.number());

      expect(response).rejects.toEqual({
        name: 'InvalidAccessError',
        message: `You can't complete this action`,
      });
    });
    it('should respond with the room id when all the data is correct', async () => {
      const fakerNumber = faker.datatype.number();
      jest.spyOn(bookingRepository, 'findRoom').mockImplementationOnce((): any => ({ id: fakerNumber }));
      jest.spyOn(ticketRepository, 'findUserEnrrolment').mockImplementationOnce((): any => true);
      jest.spyOn(ticketRepository, 'findUserTickets').mockImplementationOnce((): any => ({
        Ticket: [{ TicketType: { includesHotel: true, isRemote: false }, status: 'PAID' }],
      }));
      jest.spyOn(bookingRepository, 'findBookedRoom').mockImplementationOnce((): any => false);

      const response = await bookingService.validateUserData(faker.datatype.number(), faker.datatype.number());

      expect(response).toEqual({
        id: fakerNumber,
      });
    });
  });
});

function mockValidateUserData(id: number) {
  jest.spyOn(bookingRepository, 'findRoom').mockImplementationOnce((): any => ({ id }));
  jest.spyOn(bookingRepository, 'findBookedRoom').mockImplementationOnce((): any => false);
  jest.spyOn(ticketRepository, 'findUserEnrrolment').mockImplementationOnce((): any => true);
  jest.spyOn(ticketRepository, 'findUserTickets').mockImplementationOnce((): any => ({
    Ticket: [{ TicketType: { includesHotel: true, isRemote: false }, status: 'PAID' }],
  }));
}
