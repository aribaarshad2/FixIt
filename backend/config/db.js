const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log(`MONGO_URI defined: ${!!uri}, length: ${uri ? uri.length : 0}`);
    if (!uri) {
      console.error('MONGO_URI is not set!');
      return false;
    }
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.log('Starting server without database connection...');
    return false;
  }
};

module.exports = connectDB;
