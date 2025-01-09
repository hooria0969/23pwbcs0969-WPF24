const mongoose = require('mongoose');

require('dotenv').config(); // Load environment variables from a .env file (for local development)

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);

      process.exit(1);
    }
  }

 module.exports = connectDB;