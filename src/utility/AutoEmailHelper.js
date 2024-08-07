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

export function sendApplicationConfirm(student, formTitle, callback) {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: student.email,
        subject: `Confirmation: Your application for ${formTitle} has been submitted`,
        text: `Hi ${student.first_name},`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        callback(error, info);
    });
}

export function sendEnrollConfirm(student, formTitle, callback) {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: student.email,
        subject: `Thank you for enrolling in ${formTitle}`,
        text: `Hi ${student.first_name},\n\nYour payment has been received.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        callback(error, info);
    });
}
