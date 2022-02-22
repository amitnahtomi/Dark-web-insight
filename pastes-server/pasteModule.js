const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    content: {
        type: String,
        //required: true
    },
    entities: {
        type: [String]
    }
})

module.exports = mongoose.model('paste', pasteSchema);