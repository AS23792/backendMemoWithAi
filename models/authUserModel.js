const mongoose = require('mongoose');

const authUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        trim: true
    },
    password: {
        type: String,
        required: false,
        minlength: 6
    },
    wxOpenId: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true
});

const AuthUser = mongoose.model('AuthUser', authUserSchema);

module.exports = AuthUser; 