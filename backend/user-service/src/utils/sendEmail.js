import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Send email using nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} content - Email content (text or HTML)
 * @param {boolean} [isHtml=false] - Whether the content is HTML
 */
const sendEmail = async (to, subject, content, isHtml = false) => {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        [isHtml ? "html" : "text"]: content,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to} by sendEmail function`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Email sending failed. Please try again.");
    }
}

export { sendEmail };