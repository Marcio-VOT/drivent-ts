import { prisma } from '@/config';

async function listHotels() {
  return prisma.hotel.findMany();
}

async function findHotel(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
  });
}

async function listHotelRooms(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

export default {
  listHotels,
  listHotelRooms,
  findHotel,
};
