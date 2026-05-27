const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");



dotenv.config();
connectDB();

const app = express();

// app.use(cors({
//     origin:[
//         process.env.FRONTEND_URL || "http://localhost:5173",
//         "https://brmerntodo.netlify.app"
//     ], 
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// }));

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            "https://brmerntodo.netlify.app",
            "http://localhost:5173"
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());
app.use(cookieParser());
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/todos", require("./src/routes/todoRoutes"));

app.use("/api/auth", require("./src/routes/authRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = app;