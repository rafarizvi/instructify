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
    require: true
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    require: false
  }
})

  const Tutorial = model('Tutorial', tutorialSchema);
  
  module.exports = Tutorial;
  