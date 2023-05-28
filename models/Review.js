const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        require: [true, 'Please add a title for the review'],
        maxLength: 100
    },
    text: {
        type: String,
        required: [true, 'Please a a text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 to 10']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
})

module.exports = mongoose.model('Review', ReviewSchema)