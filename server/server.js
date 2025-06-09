require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const unitRoutes = require("./routes/unitRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const examRoutes = require("./routes/examRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const reportRoutes = require("./routes/reportRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const studentRoutes = require("./routes/studentRoutes");
const responseFormatter = require("./middleware/responseFormatter")

console.log("Environment Variables:");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "[REDACTED]" : undefined);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "[REDACTED]" : undefined);
console.log("MONGO_URI:", process.env.MONGO_URI ? "[REDACTED]" : undefined);
console.log("PORT:", process.env.PORT);

const app = express();
connectDB();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
// app.use(responseFormatter())

app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/auditLogs", auditLogRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/students", studentRoutes);

app.use(require("./middleware/errorHandler"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});