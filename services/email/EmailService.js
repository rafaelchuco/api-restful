const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

class EmailService {
  constructor() {
    console.log(`[EmailService] Inicializando transporter SMTP`);
    console.log(`  Host: smtp.gmail.com`);
    console.log(`  Port: 587`);
    console.log(`  User: ${process.env.MAILER_EMAIL}`);
    
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      family: 4,
      requireTLS: true,
      connectionTimeout: 5000,
      socketTimeout: 5000,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY
      }
    });

    // Escuchar errores del transporter
    this.transporter.on('error', (err) => {
      console.error(`[EmailService] Error de transporte:`, err.message);
    });

    console.log(`[EmailService] Transporter creado con timeouts de 5s`);
  }

  sendEmail(options) {
    const { to, subject, htmlBody } = options;

    console.log(`📧 Intentando enviar correo a: ${to}`);
    console.log(`   Subject: ${subject}`);
    
    this.transporter.sendMail({
      from: process.env.MAILER_EMAIL,
      to: to,
      subject: subject,
      html: htmlBody
    }, (err, info) => {
      if (err) {
        console.error(`✗ Error enviando email a ${to}`);
        console.error(`  Error: ${err.message}`);
        console.error(`  Code: ${err.code}`);
      } else {
        console.log(`✓ Email enviado exitosamente a ${to}`);
        console.log(`  Message ID: ${info.messageId}`);
        console.log(`  Response: ${info.response}`);
      }
    });
  }
}

module.exports = EmailService;
