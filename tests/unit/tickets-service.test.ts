import { ticketService } from '@/services';
import ticketRepository from '@/repositories/ticket-repository';

describe('service tickets test', () => {
  describe('listTicketTypes test', () => {
    it('should respond with empty array when there are no ticket types created', async () => {
      jest.spyOn(ticketRepository, 'selectAllTicketTypes').mockResolvedValueOnce([]);
      const response = await ticketService.listTicketTypes();
      expect(response).toEqual([]);
    });
    it('should respond with array of tickets types when there are ticket types created', async () => {
      jest.spyOn(ticketRepository, 'selectAllTicketTypes').mockImplementationOnce((): any => [1, 2, 3]);
      const response = await ticketService.listTicketTypes();
      expect(response.length).toEqual(3);
    });
  });
  describe('listUserTickets test', () => {
    it('should respond with notFoundError when the user has no enrollment', () => {
      jest.spyOn(ticketRepository, 'findUserEnrrolment').mockResolvedValueOnce(null);
      const response = ticketService.listUserTickets(1);
      expect(response).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
    it('should respond with notFoundError when the user has no ticket', () => {
      jest.spyOn(ticketRepository, 'findUserEnrrolment').mockResolvedValueOnce({ id: 1 });
      jest.spyOn(ticketRepository, 'findUserTickets').mockResolvedValueOnce({ Ticket: [] });

      const response = ticketService.listUserTickets(1);
      expect(response).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
    it('should respond with the first ticket from the user', async () => {
      jest.spyOn(ticketRepository, 'findUserEnrrolment').mockResolvedValueOnce({ id: 1 });
      jest.spyOn(ticketRepository, 'findUserTickets').mockImplementationOnce((): any => ({ Ticket: [3, 2, 1] }));

      const response = await ticketService.listUserTickets(1);
      expect(response).toEqual(3);
    });
  });
  describe('createNewTicket test', () => {
    it('should respond with notFoundError when the user has no enrollment', () => {
      jest.spyOn(ticketRepository, 'findUserEnrrolment').mockResolvedValueOnce(null);
      const response = ticketService.createNewTicket({ userId: 1, ticketTypeId: 1 });
      expect(response).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
    it('should respond with the new ticket when usar has a enrollment', async () => {
      jest.spyOn(ticketRepository, 'findUserEnrrolment').mockResolvedValueOnce({ id: 1 });
      jest.spyOn(ticketRepository, 'createNewTicket').mockImplementationOnce((): any => ({ data: 1 }));

      const response = await ticketService.createNewTicket({ userId: 1, ticketTypeId: 1 });
      expect(response).toEqual({
        data: 1,
      });
    });
  });
});
