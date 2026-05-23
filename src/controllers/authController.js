const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER
exports.registerUser = async (req, res) => {
    try {
        console.log("STEP 1 OK");

        const { name, email, password } = req.body;

        console.log("STEP 2 OK");

        const existingUser = await User.findOne({ email });
        console.log("STEP 3 OK");

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        console.log("STEP 4 OK");

        const salt = await bcrypt.genSalt(10);
        console.log("SALT OK");

        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("HASH OK");

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        console.log("USER CREATED:", user);

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            token,
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
 
console.log("JWT_SECRET:", process.env.JWT_SECRET);

//LOGIN
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // 2. Check password safely
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // 3. Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 4. Return response
        return res.json({
            token,
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


//Persistence

exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
}
