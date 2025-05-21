require('dotenv').config(); // Ensure this is at the top
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');

const app = express();
app.use(express.json());

// Debug: Log the MONGO_URI to verify it's loaded
console.log('MONGO_URI:', process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in .env file');
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Error Handling Middleware (assuming middleware/error.js exists)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));