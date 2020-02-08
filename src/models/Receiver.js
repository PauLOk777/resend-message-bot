const mongoose = require('mongoose');

const ReceiverSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }
});

const Receiver = mongoose.model('receiver', ReceiverSchema);

module.exports = Receiver;