import { prisma } from '@/config';

async function userBookingData(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function findRoom(roomId: number) {
  return prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
}

async function findBookedRoom(roomId: number) {
  return prisma.booking.findFirst({
    where: {
      roomId,
    },
  });
}

async function upsertBooking(userId: number, roomId: number, bookingId?: number) {
  return prisma.booking.upsert({
    where: { id: bookingId ? bookingId : -1 },
    create: {
      userId,
      roomId,
    },
    update: {
      roomId,
      updatedAt: new Date(),
    },
  });
}

const bookingRepository = {
  userBookingData,
  findRoom,
  upsertBooking,
  findBookedRoom,
};

export default bookingRepository;
