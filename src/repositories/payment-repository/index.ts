import { prisma } from '@/config';

async function findFirst(ticketId: string) {
  return await prisma.payment.findFirst({
    where: {
      ticketId: Number(ticketId),
    },
  });
}
async function findTicket(ticketId: string) {
  return await prisma.ticket.findFirst({
    where: {
      id: Number(ticketId),
    },
  });
}

async function findTicketOwner({ ticketId, userId }: { ticketId: string; userId: number }) {
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

const paymentRepository = {
  findFirst,
  findTicketOwner,
  findTicket,
};

export default paymentRepository;
