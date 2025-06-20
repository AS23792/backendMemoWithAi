const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['user', 'assistant']
    },
    content: {
        type: String,
        required: true
    }
}, { _id: false });

const chatSessionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        default: 'New Chat'
    },
    messages: [messageSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

module.exports = ChatSession; 