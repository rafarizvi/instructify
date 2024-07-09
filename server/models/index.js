// Bringing in all models
const Profile = require('./Profile');
const Category = require('./Category');
const Tutorial = require('./Tutorial');
const Comment = require('./Comment');
const Video = require('./Video');
const Donation = require('./Donation');
const Image = require('./Image')


// Exporting out the models
module.exports = { 
    Profile, 
    Category, 
    Tutorial, 
    Comment,
    Video,
    Donation,
    Image
};
