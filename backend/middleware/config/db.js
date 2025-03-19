const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant_order_system';
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true, // Optional in Mongoose v6+
      useUnifiedTopology: true, // Optional in Mongoose v6+
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;