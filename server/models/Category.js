const mongoose = require('mongoose')
const { Schema, model } = mongoose

const categorySchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    tutorials: [
      {
        type: Schema.Types.ObjectId, // Tutorials is an array of ObjectIds
        ref: 'Tutorial', // References the 'Tutorial' model
      },
    ],
  });
  
  // Create the Category model from the schema
  const Category = model('Category', categorySchema);

module.exports = Category;

