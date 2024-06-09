const mongoose = require('mongoose')
const { Schema, model } = mongoose

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // added but not using- added category to MongoDb collection instead
    // tutorials: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Tutorial',
    //   },
    // ]
})

const Category = model('Category', categorySchema);

module.exports = Category;

