const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendEmail(options) {
    const mailOptions = {
      from: `${process.env.FROM_NAME || 'Elevare'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Email send error:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    return this.sendEmail({
      email: user.email,
      subject: 'Welcome to Elevare Intelligence',
      message: `Hi ${user.fullName}, welcome to Elevare!`
    });
  }

  async sendPasswordResetEmail(user, resetUrl) {
    return this.sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message: `You requested a password reset. Click here: ${resetUrl}`
    });
  }
}

module.exports = new EmailService();
