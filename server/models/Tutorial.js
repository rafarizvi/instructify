const { Schema, model } = require('mongoose');

const {videoSchema} = require('./Video');

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
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: false
  }],
  videos: {
    type: [videoSchema],
    default: [],
  },
});

const Tutorial = model('Tutorial', tutorialSchema);

module.exports = Tutorial;
