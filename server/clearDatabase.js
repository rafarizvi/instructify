//! warning this will drop your database

//! to drop database use node clearDatabase.js on file 

const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to MongoDB');

    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped');

    mongoose.disconnect();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
