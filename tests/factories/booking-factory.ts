import { prisma } from '@/config';
import faker from '@faker-js/faker';
import { Booking } from '@prisma/client';

export async function createBooking(userId: number, roomId: number): Promise<Booking> {
  const booking = await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
  return booking;
}
