import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// POST http://localhost:3008/api/v1/email/registration-confirmation/customer-id/:customerId
export function sendRegistrationConfirmation(req, res) {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: 'sample@gmail.com',
        subject: 'Confirmation: Your application for ${Event} has been submitted',
        text: 'Testing :)'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
        }

        res.status(200).send(info.response);
    });
}
