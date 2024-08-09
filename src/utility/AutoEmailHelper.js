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
        html: `<!DOCTYPE html>
				<html>
				<head>
				  <meta charset="UTF-8">
				  <title>Course Registration Confirmation</title>
				  <style>
					body {
					  font-family: Arial, sans-serif;
					  font-size: 16px;
					  line-height: 1.5;
					  color: #333;
					  background-color: #f5f5f5;
					  margin: 0;
					  padding: 0;
					}
					.container {
					  max-width: 600px;
					  margin: 0 auto;
					  padding: 40px;
					  background-color: #fff;
					  box-shadow: 0 0 10px rgba(0,0,0,0.1);
					}
					h1 {
					  font-size: 24px;
					  font-weight: bold;
					  margin-top: 0;
					}
					p {
					  margin-bottom: 20px;
					}
					.important {
					  font-weight: bold;
					  color: #ff0000;
					}
					.button {
					  display: inline-block;
					  background-color: #007bff;
					  color: #fff;
					  text-decoration: none;
					  padding: 10px 20px;
					  border-radius: 5px;
					  transition: background-color 0.3s ease;
					}
					.button:hover {
					  background-color: #0056b3;
					}
				  </style>
				</head>
				<body>
				  <div class="container">
					<h1>Thank you for your course registration!</h1>
					<p>Dear ${student.first_name},</p>
					<p>We have received your registration. An invoice will be sent to you via PayPal within the next 2 business days. You can complete the payment by credit card, and a PayPal account is not required.</p>
					<p class="important">Please be sure to check your Spam/Junk email folder for the invoice.</p>
					<p>Best regards,</p>
					<p>CICS</p>
				  </div>
				</body>
				</html>`
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
