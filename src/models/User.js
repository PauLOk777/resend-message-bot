const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true }
    isAdmin: { type: Boolean, required: true }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;