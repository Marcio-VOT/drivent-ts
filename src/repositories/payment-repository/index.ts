import { prisma } from '@/config';
import { Payment, Ticket } from '@prisma/client';

async function findFirst(ticketId: string): Promise<Payment> {
  return await prisma.payment.findFirst({
    where: {
      ticketId: Number(ticketId),
    },
  });
}
async function findTicket(ticketId: string): Promise<Ticket> {
  return await prisma.ticket.findFirst({
    where: {
      id: Number(ticketId),
    },
  });
}

async function findTicketOwner({ ticketId, userId }: { ticketId: string; userId: number }): Promise<{
  Ticket: Ticket[];
}> {
  return prisma.enrollment.findFirst({
    where: {
      userId: userId,
    },
    select: {
      Ticket: {
        where: {
          id: Number(ticketId),
        },
      },
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

async function makeTicketPayment({ ticketId, value, cardIssuer, cardLastDigits }: TicketPaymentInfo): Promise<Payment> {
  return prisma.payment.create({
    data: {
      ticketId,
      value,
      cardIssuer,
      cardLastDigits,
    },
  });
}

async function updateTciketPaymentStatus(ticketId: string) {
  await prisma.ticket.update({
    where: {
      id: Number(ticketId),
    },
    data: { status: 'PAID' },
  });
}

export type TicketPaymentInfo = Omit<Payment, 'id' | 'updatedAt' | 'createdAt'>;

const paymentRepository = {
  findFirst,
  findTicketOwner,
  findTicket,
  makeTicketPayment,
  findTicketType,
  updateTciketPaymentStatus,
};

export default paymentRepository;
