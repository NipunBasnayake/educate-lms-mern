const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const unitRoutes = require('./routes/unitRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const examRoutes = require('./routes/examRoutes');
const lessonRoutes = require('./routes/lessonRoutes');

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/auditLogs', auditLogRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/lessons', lessonRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});