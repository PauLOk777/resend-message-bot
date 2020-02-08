const mongoose = require('mongoose');

const ChanelSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

const Chanel = mongoose.model('chanel', ChanelSchema);

module.exports = Chanel;