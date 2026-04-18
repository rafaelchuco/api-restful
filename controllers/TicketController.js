const TicketService = require("../services/TicketService");
const NotificationService = require("../services/NotificationService");

const service = new TicketService();
const notificationService = new NotificationService();

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parsePositiveInt(value, fieldName) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    throw createHttpError(400, `El parámetro ${fieldName} debe ser un número mayor a 0`);
  }
  return parsed;
}

exports.create = (req, res, next) => {
  try {
    const ticket = service.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.list = (req, res, next) => {
  try {
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;

    if (!hasPagination) {
      return res.status(200).json(service.list());
    }

    const page = req.query.page !== undefined ? parsePositiveInt(req.query.page, "page") : 1;
    const limit = req.query.limit !== undefined ? parsePositiveInt(req.query.limit, "limit") : 5;

    return res.status(200).json(service.list(page, limit));
  } catch (error) {
    next(error);
  }
};

exports.assign = (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req.body;
    const ticket = service.assignTicket(id, user);
    if (!ticket) {
      throw createHttpError(404, "Ticket no encontrado");
    }

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.changeStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ticket = service.changeStatus(id, status);
    if (!ticket) {
      throw createHttpError(404, "Ticket no encontrado");
    }

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.delete = (req, res, next) => {
  try {
    service.deleteTicket(req.params.id);
    res.status(200).json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

exports.notificationsByTicket = (req, res, next) => {
  try {
    const { id } = req.params;
    const notifications = notificationService.listByTicketId(id);
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};
