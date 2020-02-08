const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    resendBotId: { type: String, required: true, unique: true },
    login: { type: String, required: true, unique: true },
    logged: { type: Boolean, default: true },
});

const Session = mongoose.model('session', SessionSchema);

module.exports = Session;