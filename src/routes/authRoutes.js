const express = require("express");
const router = express.Router();
const {registerUser, loginUser, getMe, refreshToken, uploadProfileImage, logoutUser, verifyEmail, resendVerification} = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");
const User = require("../models/User");
const upload = require("../middlewares/upload");
const { authLimiter, loginLimiter } = require("../middlewares/rateLimiters");

router.use(express.json());


router.post("/register", registerUser);

router.post("/login", loginLimiter, loginUser);

router.post("/verify-email", authLimiter, verifyEmail);
router.post("/resend-verification", authLimiter, resendVerification);

router.get("/me", protect, getMe);

router.post("/refresh", authLimiter, refreshToken) 

router.post("/logout", authLimiter, logoutUser);

router.post(
    "/upload-profile",
    protect,
    upload.single("image"),
    uploadProfileImage
);


module.exports = router;    