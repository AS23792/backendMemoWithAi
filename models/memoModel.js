const mongoose = require('mongoose');

const memoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
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

const Memo = mongoose.model('Memo', memoSchema);

module.exports = Memo;