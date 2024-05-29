const { Schema, model } = require('mongoose');

const videoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
}, { _id: true });  

const Video = model('Video', videoSchema);

module.exports = { Video, videoSchema };
