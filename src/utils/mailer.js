const nodemailer = require("nodemailer");

const getRequiredEnv = (key) => {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required env var: ${key}`);
    return value;
};

const getTransport = () => {
    const host = getRequiredEnv("SMTP_HOST");
    const port = Number(getRequiredEnv("SMTP_PORT"));
    const user = getRequiredEnv("SMTP_USER");
    const pass = getRequiredEnv("SMTP_PASS");

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for 587/2525
        auth: { user, pass },
    });
};

const sendEmailVerification = async ({ to, verifyUrl }) => {
    const from = getRequiredEnv("SMTP_FROM_EMAIL");
    const transporter = getTransport();

    await transporter.sendMail({
        from,
        to,
        subject: "Verify your email",
        text: `Verify your email: ${verifyUrl}`,
        html: `
            <p>Welcome!</p>
            <p>Please verify your email by clicking the link below:</p>
            <p><a href="${verifyUrl}">Verify email</a></p>
            <p>If you did not create this account, you can ignore this email.</p>
        `,
    });
};

module.exports = { sendEmailVerification };

