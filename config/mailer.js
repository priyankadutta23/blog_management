const nodemailer = require('nodemailer');

class GmailMailer {
    constructor() {

    }
    async sendMail(from, to, subject, html) {
        try {
            //Setup the transporter
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_APP_EMAIL,
                    pass: process.env.GMAIL_APP_PASSWORD,
                },
            });
            //Setup the mailOptions
            let mailOptions = {
                from,
                to,
                subject,
                html
            };
            //Its time to fire email
            return await transporter.sendMail(mailOptions);
        } catch (err) {
            throw err;
        }
    }

}

module.exports = new GmailMailer();