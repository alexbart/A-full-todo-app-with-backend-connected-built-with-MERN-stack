const express = require("express");
const router = express.Router();
const {registerUser, loginUser, getMe, refreshToken, uploadProfileImage, logoutUser} = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");
const User = require("../models/User");
const upload = require("../middlewares/upload");

router.use(express.json());


router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getMe);

router.post("/refresh", refreshToken) 

router.post("/logout", logoutUser);

router.post(
    "/upload-profile",
    protect,
    upload.single("image"),
    uploadProfileImage
);


module.exports = router;    