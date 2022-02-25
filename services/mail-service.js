const nodemailer = require('nodemailer');
require('dotenv').config();

class MailService {

    // CONFIGURE BEFORE PRODUCTION!!!
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: 'Autopac account activation',
            text: '',
            html:
                `
                    <div>
                        <h3>Click <a href="${link}">here</a> to activate your account</h3>
                    </div>
                `
        })
    }
}

module.exports = new MailService();