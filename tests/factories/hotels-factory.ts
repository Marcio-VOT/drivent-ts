import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotelAndRooms() {
  return await prisma.hotel.create({
    data: {
      name: faker.lorem.sentence(),
      image: faker.image.imageUrl(),
      Rooms: {
        createMany: {
          data: [
            {
              name: faker.lorem.sentence(),
              capacity: 5,
            },
            {
              name: faker.lorem.sentence(),
              capacity: 5,
            },
            {
              name: faker.lorem.sentence(),
              capacity: 1,
            },
            {
              name: faker.lorem.sentence(),
              capacity: 1,
            },
          ],
        },
      },
    },
    include: {
      Rooms: true,
    },
  });
}
