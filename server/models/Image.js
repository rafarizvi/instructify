//Bringing in required mongoose packages
const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
    link: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    tutorial: {
        type: Schema.Types.ObjectId,
        ref: 'Tutorial'
      }
})

const Image = model('Image', imageSchema);

module.exports = Image;
