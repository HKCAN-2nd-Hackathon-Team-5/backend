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

const emailStyle = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
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
            </style>
        </head>
        <body>
            <div class="container">
`;

export function sendApplicationConfirm(name, email, formTitle, lang) {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email
    };

    switch (lang) {
        case 'en':
            mailOptions.subject = 'Thank you for your course registration!';
            mailOptions.html = emailStyle + `
                            <h1>Thank you for your course registration!</h1>
                            <p>Hi ${name},</p>
                            <p>We have received your application for ${formTitle}. An invoice will be sent to you via PayPal within the next 2 business days. You can complete the payment by credit card, and a PayPal account is not required.</p>
                            <p class="important">Please be sure to check your Spam/Junk email folder for the invoice.</p>
                            <p>Best regards,</p>
                            <p>CICS Centre for Learning</p>
                        </div>
                    </body>
                </html>
            `;
            break;
        case 'zh-hant':
        case 'zh_hant':
            mailOptions.subject = '感謝您的課程報名！';
            mailOptions.html = emailStyle + `
                            <h1>感謝您的課程報名！</h1>
                            <p>${name} 您好：</p>
                            <p>我們已經收到您報名參加「${formTitle}」的申請。我們將在接下來的兩個工作日內通過 PayPal 將發票寄送給您。您可以使用信用卡完成付款，並且不需要 PayPal 帳戶。</p>
                            <p class="important">請務必檢查您的垃圾郵件資料夾以查看發票。</p>
                            <p>祝安康</p>
                            <p>華諮處樂研教育中心</p>
                        </div>
                    </body>
                </html>
            `;
            break;
        case 'zh':
            mailOptions.subject = '感谢您的课程报名！';
            mailOptions.html = emailStyle + `
                            <h1>感谢您的课程报名！</h1>
                            <p>${name} 您好：</p>
                            <p>我们已经收到您报名参加「${formTitle}」的申请。我们将在接下来的两个工作日内通过 PayPal 将发票寄送给您。您可以使用信用卡完成付款，并且不需要 PayPal 账户。</p>
                            <p class="important">请务必检查您的垃圾邮件文件夹以查看发票。</p>
                            <p>祝安康</p>
                            <p>华咨处乐研教育中心</p>
                        </div>
                    </body>
                </html>
            `;
            break;
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return;
        }

        console.log(info.response);
    });
}

export function sendEnrollConfirm(name, email, formTitle, lang) {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email
    };

    switch (lang) {
        case 'en':
            mailOptions.subject = 'Thank you for your payment!';
            mailOptions.html = emailStyle + `
                            <h1>Thank you for your payment!</h1>
                            <p>Hi ${name},</p>
                            <p>We have received your payment for ${formTitle}. Congratulations on successfully completing the enrollment process! We look forward to seeing you soon.</p>
                            <p class="important">If you have any questions, feel free to contact us anytime.</p>
                            <p>Best regards,</p>
                            <p>CICS Centre for Learning</p>
                        </div>
                    </body>
                </html>
            `;
            break;
        case 'zh-hant':
        case 'zh_hant':
            mailOptions.subject = '感謝您的付款！';
            mailOptions.html = emailStyle + `
                            <h1>感謝您的付款！</h1>
                            <p>${name} 您好：</p>
                            <p>我們已經收到您報名參加「${formTitle}」的付款。恭喜您成功完成報名程序！期待與您的相遇。</p>
                            <p class="important">如果您有任何問題，請隨時與我們聯繫。</p>
                            <p>祝安康</p>
                            <p>華咨處樂研教育中心</p>
                        </div>
                    </body>
                </html>
            `;
            break;
        case 'zh':
            mailOptions.subject = '感谢您的付款！';
            mailOptions.html = emailStyle + `
                            <h1>感谢您的付款！</h1>
                            <p>${name} 您好：</p>
                            <p>我们已经收到您报名参加「${formTitle}」的付款。恭喜您成功完成报名程序！期待与您的相遇。</p>
                            <p class="important">如果您有任何问题，请随时与我们联系。</p>
                            <p>祝安康</p>
                            <p>华咨处乐研教育中心</p>
                        </div>
                    </body>
                </html>
            `;
            break;
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return;
        }

        console.log(info.response);
    });
}
