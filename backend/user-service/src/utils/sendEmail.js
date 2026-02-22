import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async (to, subject, content, isHtml = false) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            [isHtml ? "html" : "text"]: content,
        });

        console.log(`✅ Email sent to ${to}`);
        console.log("Message ID:", info.messageId);

        return info;
    } catch (error) {
        console.error("❌ Brevo SMTP Error:", error);
        throw new Error("Email sending failed. Please try again.");
    }
};

export { sendEmail };