const mongoose = require('mongoose');
const { Schema } = mongoose;

const donationSchema = new Schema({
  donationAmount: {
    type: Number,
    required: true
  }
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
