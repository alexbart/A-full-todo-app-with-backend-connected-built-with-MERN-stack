const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


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

        // CHECK EXISTING USER
        const existingUser = await User.findOne({ email });

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
            email,
            password: hashedPassword,
        });

        // TOKENS
        const accessToken = generateAccessToken(user._id);

        const refreshToken = generateRefreshToken(user._id);

        // STORE REFRESH TOKEN COOKIE
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // true in production
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // RESPONSE
        return res.status(201).json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
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

        // FIND USER
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
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
            secure: false, // true in production
            sameSite: "strict",
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

exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

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