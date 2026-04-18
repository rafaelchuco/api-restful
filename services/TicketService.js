const { v4: uuidv4 } = require("uuid");
const TicketRepository = require("../repositories/TicketRepository");
const NotificationService = require("./NotificationService");

class TicketService {
  constructor() {
    this.repo = new TicketRepository();
    this.notificationService = new NotificationService();
  }

  createTicket(data) {
    const ticket = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: "nuevo",
      priority: data.priority || "medium",
      assignedUser: null
    };

    this.repo.save(ticket);
    this.notificationService.create("email", `Nuevo ticket creado: ${ticket.title}`, ticket.id);

    return ticket;
  }

  assignTicket(id, user) {
    const ticket = this.repo.update(id, { assignedUser: user });
    if (ticket) {
      this.notificationService.create("email", `El ticket ${ticket.id} fue asignado a ${user}`, ticket.id);
    }
    return ticket;
  }

  changeStatus(id, newStatus) {
    const ticket = this.repo.update(id, { status: newStatus });
    if (ticket) {
      this.notificationService.create("push", `El ticket ${ticket.id} cambió a ${newStatus}`, ticket.id);
    }
    return ticket;
  }

  list(page, limit) {
    const tickets = this.repo.findAll();

    if (page === undefined && limit === undefined) {
      return tickets;
    }

    const start = (page - 1) * limit;
    const data = tickets.slice(start, start + limit);
    const total = tickets.length;
    const totalPages = total === 0 ? 1 : Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }

  deleteTicket(id) {
    const deleted = this.repo.delete(id);
    if (!deleted) {
      const error = new Error("Ticket no encontrado");
      error.statusCode = 404;
      throw error;
    }
    return true;
  }
}

module.exports = TicketService;
