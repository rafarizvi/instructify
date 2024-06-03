const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/instructify';

console.log(`Connecting to MongoDB with URI: ${mongoURI}`);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(`Error connecting to MongoDB: ${err.message}`);
});

db.once('open', () => {
  console.log('Successfully connected to MongoDB');
});

module.exports = db;
