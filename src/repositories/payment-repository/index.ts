import { prisma } from '@/config';

async function findFirst(ticketId: string) {
  return await prisma.payment.findFirst({
    where: {
      ticketId: Number(ticketId),
    },
  });
}
async function findAll() {
  return await prisma.payment.findMany({});
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

  // prisma.user.findUnique({
  //   where: {
  //     id: userId,
  //   },
  //   select: {
  //     Enrollment: {
  //       where: {
  //         Ticket: {
  //           some: {
  //             id: Number(ticketId),
  //           },
  //         },
  //       },
  //       select: {
  //         Ticket: {
  //           where: {
  //             id: Number(ticketId),
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
}

const paymentRepository = {
  findFirst,
  findTicketOwner,
  findAll,
};

export default paymentRepository;
