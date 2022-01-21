const mongoose = require('mongoose')
const { Schema, model } = mongoose

const TodoSchema = new Schema({
    content: {
        type: String,
        required: [true, 'You must add some content.'],
        maxLength: [140, 'Your todo item cannot be longer than 100 characters.'],
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'User must be provided']
    }
}, { timestamps: true})

const Todo = model('Todo', TodoSchema)
module.exports = Todo