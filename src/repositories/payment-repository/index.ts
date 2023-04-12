import { prisma } from '@/config';

async function findFirst(ticketId: string) {
  return await prisma.payment.findMany({
    where: {
      ticketId: Number(ticketId),
    },
  });
}

async function findTicketOwner({ ticketId, userId }: { ticketId: string; userId: number }) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      Enrollment: {
        where: {
          Ticket: {
            some: {
              id: Number(ticketId),
            },
          },
        },
        select: {
          Ticket: {
            where: {
              id: Number(ticketId),
            },
          },
        },
      },
    },
  });
}

const paymentRepository = {
  findFirst,
  findTicketOwner,
};

export default paymentRepository;
