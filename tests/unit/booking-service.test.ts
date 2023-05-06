import bookingService from '@/services/booking-service';
import faker from '@faker-js/faker';
import bookingRepository from '@/repositories/booking-repository';
import ticketRepository from '@/repositories/ticket-repository';

// jest.mock('@/services/booking-service', () => {
//   const org = jest.requireActual('@/services/booking-service');
//   org.default.validateUserData = jest.fn().mockImplementation((): any => ({
//     id: 999,
//   }));
//   return { ...org.default };
// });

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
  describe('validateUserData test', () => {});
});

function mockValidateUserData(id: number) {
  jest.spyOn(bookingRepository, 'findRoom').mockImplementationOnce((): any => ({ id }));
  jest.spyOn(bookingRepository, 'findBookedRoom').mockImplementationOnce((): any => false);
  jest.spyOn(ticketRepository, 'findUserEnrrolment').mockImplementationOnce((): any => true);
  jest.spyOn(ticketRepository, 'findUserTickets').mockImplementationOnce((): any => ({
    Ticket: [{ TicketType: { includesHotel: true, isRemote: false }, status: 'PAID' }],
  }));
}
