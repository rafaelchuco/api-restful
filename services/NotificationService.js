const { v4: uuidv4 } = require("uuid");
const NotificationRepository = require("../repositories/NotificationRepository");
const EmailService = require("./email/EmailService");

class NotificationService {
  constructor() {
    this.repo = new NotificationRepository();
    this.emailService = new EmailService();
  }

  create(type, message, ticketId) {
    console.log(`[NotificationService] Creando notificación: type=${type}, message=${message}, ticketId=${ticketId}`);
    
    const notification = {
      id: uuidv4(),
      type,
      message,
      status: "pending",
      ticketId
    };

    if (type == "email") {
      console.log(`[NotificationService] Tipo es EMAIL, llamando EmailService.sendEmail()`);
      this.emailService.sendEmail({
        to: process.env.MAILER_TO,
        subject: "API RESTful - Alertas del sistema de Tickets",
        htmlBody: "<h1>" + message + " </h1>"
      });
    }

    const saved = this.repo.save(notification);
    console.log(`[NotificationService] Notificación guardada:`, saved);
    return saved;
  }

  list() {
    return this.repo.findAll();
  }

  listByTicketId(ticketId) {
    return this.repo.findByTicketId(ticketId);
  }
}

module.exports = NotificationService;
