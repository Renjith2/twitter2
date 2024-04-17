const mongoose = require('mongoose');
const User = require('./userModel');
const Comment = require('./commentModel');

const blogSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment' 
    }]
});

module.exports = mongoose.model('Blog', blogSchema);
