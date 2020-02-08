const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

const Channel = mongoose.model('channel', ChannelSchema);

module.exports = Channel;