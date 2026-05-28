// const { Resend } = require("resend");

// const getRequiredEnv = (key) => {
//     const value = process.env[key];
//     if (!value) throw new Error(`Missing required env var: ${key}`);
//     return value;
// };

// const getResend = () => {
//     const apiKey = getRequiredEnv("RESEND_API_KEY");
//     return new Resend(apiKey);
// };

// const sendEmailVerification = async ({ to, verifyUrl }) => {
//     const from = getRequiredEnv("RESEND_FROM_EMAIL");
//     const resend = getResend();

//     try {
//         await resend.emails.send({
//             from,
//             to: [to],
//             subject: "Verify your email",
//             text: `Verify your email: ${verifyUrl}`,
//             html: `
//                 <p>Welcome!</p>
//                 <p>Please verify your email by clicking the link below:</p>
//                 <p><a href="${verifyUrl}">Verify email</a></p>
//                 <p>If you did not create this account, you can ignore this email.</p>
//             `,
//         });
//     } catch (err) {
//         // Make failures visible in Render logs.
//         console.error("EMAIL_SEND_FAILED", {
//             to,
//             from,
//             message: err?.message,
//             code: err?.code,
//             response: err?.response || err?.cause,
//         });
//         throw err;
//     }
// };

//module.exports = { sendEmailVerification };


//Mailer with logs:

const { Resend } = require("resend");

const getRequiredEnv = (key) => {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required env var: ${key}`);
    return value;
};

const getResend = () => {
    const apiKey = getRequiredEnv("RESEND_API_KEY");
    return new Resend(apiKey);
};

const sendEmailVerification = async ({ to, verifyUrl }) => {
    const from = getRequiredEnv("RESEND_FROM_EMAIL");
    const resend = getResend();

    // ✅ DEBUG LOGS (IMPORTANT)
    console.log("📧 Sending email to:", to);
    console.log("🔗 Verify URL:", verifyUrl);
    console.log("📨 From:", from);

    try {
        const result = await resend.emails.send({
            from,
            to: [to],
            subject: "Verify your email",
            text: `Verify your email: ${verifyUrl}`,
            html: `
                <p>Welcome!</p>
                <p>Please verify your email by clicking the link below:</p>
                <p><a href="${verifyUrl}">Verify email</a></p>
                <p>If you did not create this account, you can ignore this email.</p>
            `,
        });

        // ✅ SUCCESS LOG
        console.log("✅ EMAIL_SENT_SUCCESS:", result);

    } catch (err) {
        // ❌ FAILURE LOG (you already had this — good)
        console.error("EMAIL_SEND_FAILED", {
            to,
            from,
            message: err?.message,
            code: err?.code,
            response: err?.response || err?.cause,
        });

        throw err;
    }
};

module.exports = { sendEmailVerification };