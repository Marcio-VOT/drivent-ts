import faker from '@faker-js/faker';
import { Room, TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  generateCreditCardData,
  createHotelAndRooms,
  createBooking,
} from '../factories';
import { prisma } from '@/config';
import app, { init } from '@/app';
import { cleanDb, generateValidToken } from '../helpers';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user not have a booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and booking info', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotelAndRooms();
      const roomId = hotel.Rooms[0].id;
      await createBooking(user.id, roomId);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          Room: expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            capacity: expect.any(Number),
            hotelId: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        }),
      );
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 403 if ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotelAndRooms();
      const roomId = hotel.Rooms[0].id;
      const body = { roomId };
      const ticketType = await createTicketType();
      const enrollment = await createEnrollmentWithAddress(user);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await prisma.ticketType.update({
        where: {
          id: ticketType.id,
        },
        data: {
          isRemote: true,
          includesHotel: true,
        },
      });

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it('should respond with status 403 if ticket doesnt include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotelAndRooms();
      const roomId = hotel.Rooms[0].id;
      const body = { roomId };
      const ticketType = await createTicketType();
      const enrollment = await createEnrollmentWithAddress(user);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await prisma.ticketType.update({
        where: {
          id: ticketType.id,
        },
        data: {
          isRemote: false,
          includesHotel: false,
        },
      });

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it('should respond with status 403 if ticket is not payed', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotelAndRooms();
      const roomId = hotel.Rooms[0].id;
      const body = { roomId };
      const ticketType = await createTicketType();
      const enrollment = await createEnrollmentWithAddress(user);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await prisma.ticketType.update({
        where: {
          id: ticketType.id,
        },
        data: {
          isRemote: false,
          includesHotel: true,
        },
      });

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it('should respond with status 403 if room is full', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotelAndRooms();
      const roomId = hotel.Rooms[0].id;
      const body = { roomId };
      const ticketType = await createTicketType();
      const enrollment = await createEnrollmentWithAddress(user);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await prisma.ticketType.update({
        where: {
          id: ticketType.id,
        },
        data: {
          isRemote: false,
          includesHotel: true,
        },
      });

      await createBooking((await createUser()).id, roomId);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it('should respond with status 404 if room doesnt exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotelAndRooms();
      const roomId = hotel.Rooms[0].id;
      const body = { roomId };
      const ticketType = await createTicketType();
      const enrollment = await createEnrollmentWithAddress(user);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await prisma.ticketType.update({
        where: {
          id: ticketType.id,
        },
        data: {
          isRemote: false,
          includesHotel: true,
        },
      });

      await prisma.room.delete({
        where: {
          id: roomId,
        },
      });

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 200 if everything is ok', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotelAndRooms();
      const roomId = hotel.Rooms[0].id;
      const body = { roomId };
      const ticketType = await createTicketType();
      const enrollment = await createEnrollmentWithAddress(user);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await prisma.ticketType.update({
        where: {
          id: ticketType.id,
        },
        data: {
          isRemote: false,
          includesHotel: true,
        },
      });

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.OK);
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 403 if doesnt have a booking', async () => {});
    it('should respond with status 403 if new room is full', async () => {});
    it('should respond with status 404 if room doesnt exist', async () => {});
    it('should respond with status 403 if ticket is remote', async () => {});
    it('should respond with status 403 if ticket doesnt include hotel', async () => {});
    it('should respond with status 403 if ticket is not payed', async () => {});
    it('should respond with status 200 if everything is ok', async () => {});
  });
});
