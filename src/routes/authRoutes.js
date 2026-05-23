const express = require("express");
const router = express.Router();

const {registerUser, loginUser, getMe, refreshToken} = require("../controllers/authController");

const protect = require("../middlewares/authMiddleware");


router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getMe);

router.post("/refresh", refreshToken) 


module.exports = router;    