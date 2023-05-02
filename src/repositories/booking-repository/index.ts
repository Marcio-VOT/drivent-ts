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

async function deleteBooking(bookingId: number) {
  prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });
}

async function upsertBooking(userId: number, roomId: number, bookingId?: number) {
  return prisma.booking.upsert({
    where: { id: bookingId || -1 },
    create: {
      userId,
      roomId,
    },
    update: {
      roomId,
    },
  });
}

const bookingRepository = {
  userBookingData,
  findRoom,
  deleteBooking,
  upsertBooking,
  findBookedRoom,
};

export default bookingRepository;
