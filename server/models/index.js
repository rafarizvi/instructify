// Bringing in all models
const User = require('./User');
const Category = require('./Category');
const Tutorial = require('./Tutorial');
const Comment = require('./Comment');

// Exporting out the models
module.exports = { 
    User, 
    Category, 
    Tutorial, 
    Comment };
