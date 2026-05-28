const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmailVerification } = require("../utils/mailer");

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isValidEmail = (email) => {
    if (typeof email !== "string") return false;
    const value = email.trim();
    if (!value) return false;
    // Pragmatic format check (not RFC-perfect).
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
};

const isStrongPassword = (password) => {
    if (typeof password !== "string") return false;
    if (password.length < 8) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[^A-Za-z0-9]/.test(password)) return false;
    return true;
};

const sha256 = (value) =>
    crypto.createHash("sha256").update(String(value)).digest("hex");

const buildFrontendUrl = (path) => {
    const base = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
    const cleanPath = String(path || "").startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath}`;
};

const createEmailVerificationToken = () => {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(token);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    return { token, tokenHash, expires };
};

// =========================
// TOKEN HELPERS
// =========================

const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};


// =========================
// REGISTER
// =========================

exports.registerUser = async (req, res) => {
    try {

        console.log("REGISTER REQUEST BODY:", req.body);


        const { name, email, password } = req.body;

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Please provide a valid email address." });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.",
            });
        }

        // CHECK EXISTING USER
        const trimmedEmail = String(email || "").trim();
        const normalizedEmail = trimmedEmail.toLowerCase();
        const existingUser = await User.findOne({
            email: new RegExp(`^${escapeRegex(trimmedEmail)}$`, "i"),
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // HASH PASSWORD
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // CREATE USER
        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
        });

        const { token, tokenHash, expires } = createEmailVerificationToken();
        user.emailVerificationTokenHash = tokenHash;
        user.emailVerificationExpires = expires;
        await user.save();

        const verifyUrl = buildFrontendUrl(
            `/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`
        );
        await sendEmailVerification({ to: user.email, verifyUrl });

        // RESPONSE
        return res.status(201).json({
            message: "Registration successful. Please check your email to verify your account.",
        });

    } catch (error) {

        console.log("REGISTER ERROR:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// =========================
// LOGIN
// =========================

exports.loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const trimmedEmail = String(email || "").trim();
        const normalizedEmail = trimmedEmail.toLowerCase();

        // FIND USER
        const user = await User.findOne({
            email: new RegExp(`^${escapeRegex(trimmedEmail)}$`, "i"),
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        if (!user.emailVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in.",
            });
        }

        // CHECK PASSWORD
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // TOKENS
        const accessToken = generateAccessToken(user._id);

        const refreshToken = generateRefreshToken(user._id);

        // COOKIE
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // true in production
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // RESPONSE
        return res.json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.log("LOGIN ERROR:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// =========================
// REFRESH ACCESS TOKEN
// =========================

exports.refreshToken = (req, res) => {

    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({
            message: "No refresh token"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        );

        const accessToken = generateAccessToken(
            decoded.userId
        );

        return res.json({
            accessToken
        });

    } catch (err) {

        return res.status(403).json({
            message: "Invalid refresh token"
        });
    }
};


// =========================
// CURRENT USER
// =========================

exports.getMe = async (req, res) => {

    try {

        const user = await User.findById(
            req.user.userId
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.json(user);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });
    }
};


// UPLOAD LOGIC

// exports.uploadProfileImage = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "No file uploaded" });
//         }

//         const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

//         const user = await User.findByIdAndUpdate(
//             req.user.userId,
//             { profileImage: imageUrl },
//             { new: true }
//         ).select("-password");


//         return res.json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             profileImage: user.profileImage
//         });
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// };

exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Cloudinary URL comes directly from multer-cloudinary
        const imageUrl = req.file.path;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { profileImage: imageUrl },
            { new: true }
        ).select("-password");

        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// =========================
// LOGOUT (clear refresh cookie)
// =========================

exports.logoutUser = (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res.json({ message: "Logged out" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// =========================
// VERIFY EMAIL
// =========================

exports.verifyEmail = async (req, res) => {
    try {
        const token = req.body?.token || req.query?.token;
        if (!token) {
            return res.status(400).json({ message: "Missing token" });
        }

        const tokenHash = sha256(token);
        const user = await User.findOne({
            emailVerificationTokenHash: tokenHash,
            emailVerificationExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.emailVerified = true;
        user.emailVerificationTokenHash = null;
        user.emailVerificationExpires = null;
        await user.save();

        return res.json({ message: "Email verified successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// =========================
// RESEND VERIFICATION
// =========================

exports.resendVerification = async (req, res) => {
    try {
        const email = req.body?.email;
        if (!isValidEmail(email)) {
            return res.json({ message: "If the account exists, a verification email has been sent." });
        }

        const trimmedEmail = String(email || "").trim();
        const user = await User.findOne({
            email: new RegExp(`^${escapeRegex(trimmedEmail)}$`, "i"),
        });

        if (!user || user.emailVerified) {
            return res.json({ message: "If the account exists, a verification email has been sent." });
        }

        const { token, tokenHash, expires } = createEmailVerificationToken();
        user.emailVerificationTokenHash = tokenHash;
        user.emailVerificationExpires = expires;
        await user.save();

        const verifyUrl = buildFrontendUrl(
            `/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`
        );
        await sendEmailVerification({ to: user.email, verifyUrl });

        return res.json({ message: "If the account exists, a verification email has been sent." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
