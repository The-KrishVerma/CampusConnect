import 'dotenv/config';
import nodemailer from "nodemailer";

console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_USER:", process.env.SMTP_USER);

const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: {user: process.env.SMTP_USER, pass: process.env.SMTP_PASS},
});

async function run() {
    try {
        const info = await mailer.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.ADMIN_EMAIL,
            subject: 'Test email',
            text: 'This is a test'
        });
        console.log("Email sent successfully", info.messageId);
    } catch (e) {
        console.error("Error sending email:", e);
    }
}

run();
