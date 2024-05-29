//Bringing in required mongoose package
const { Schema, model } = require('mongoose');

const tutorialSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    require: false
  },
  videoId: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
})

  const Tutorial = model('Tutorial', tutorialSchema);
  
  module.exports = Tutorial;
  