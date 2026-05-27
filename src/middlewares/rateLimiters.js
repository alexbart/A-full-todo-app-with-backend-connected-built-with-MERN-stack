const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 30, // per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many login attempts, please try again later." },
});

module.exports = { authLimiter, loginLimiter };

