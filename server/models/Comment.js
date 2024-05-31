//Bringing in required mongoose packages
const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    content: {
        type: String,
        require: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    tutorial: {
        type: Schema.Types.ObjectId,
        ref: 'Tutorial'
      },
      createdAt: {
        type: Date,
        default: Date.now,
    }, 
}, { timestamps: true })

const Comment = model('Comment', commentSchema);

module.exports = Comment;

