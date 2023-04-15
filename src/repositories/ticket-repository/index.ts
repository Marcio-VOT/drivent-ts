import { prisma } from '@/config';
import { TicketType } from '@prisma/client';

async function selectAllTicketTypes(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

async function findUserTickets(userId: number) {
  return prisma.enrollment.findUnique({
    where: {
      userId: userId,
    },
    select: {
      Ticket: {
        include: {
          TicketType: true,
        },
      },
    },
  });
}

async function createNewTicket({ ticketTypeId, enrollmentId }: { ticketTypeId: number; enrollmentId: number }) {
  return await prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: 'RESERVED',
    },
    include: {
      TicketType: true,
    },
  });
}

async function findUserEnrrolment(userId: number) {
  return await prisma.enrollment.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });
}

async function findTicketType(tiketTypeId: number) {
  return prisma.ticketType.findUnique({
    where: {
      id: tiketTypeId,
    },
  });
}

const ticketRepository = {
  selectAllTicketTypes,
  findUserTickets,
  createNewTicket,
  findTicketType,
  findUserEnrrolment,
};

export default ticketRepository;
