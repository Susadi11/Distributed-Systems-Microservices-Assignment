require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Verify MONGO_URI exists
    if (!process.env.MONGOURI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    await mongoose.connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;