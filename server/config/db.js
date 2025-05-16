const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'educate-lms',
    });
    console.log(`MongoDB Connected: ${conn.connection.host}, Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error(`Full Error: ${JSON.stringify(error, null, 2)}`);
    process.exit(1);
  }
};

module.exports = connectDB;