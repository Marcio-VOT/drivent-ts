import bookingService from '@/services/booking-service';
import { createUser } from '../factories';
import faker from '@faker-js/faker';
import bookingRepository from '@/repositories/booking-repository';

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
  describe('registerNewBooking test', () => {});
  describe('changeBookingRoom test', () => {});
  describe('validateUserData test', () => {});
});
