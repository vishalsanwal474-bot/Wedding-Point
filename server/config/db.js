const mongoose = require('mongoose');

async function connectDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined. Set it in server/.env');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri);

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}

module.exports = { connectDatabase };
