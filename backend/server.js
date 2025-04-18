require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");


// Connect to MongoDB
connectDB();

// // Import Routes
const authRoutes = require("./router/auth.router");
const courseRoutes = require("./router/CourseRoutes");
const attendacneRoutes = require("./router/attendanceRoutes");
const examRoutes = require("./router/ExamRoutes");
const userRoutes = require("./router/userRoutes");
const ResultRoutes = require("./router/ResultRouter");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());



app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/attendance", attendacneRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/users", userRoutes);
app.use("/api/result" , ResultRoutes);


// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
