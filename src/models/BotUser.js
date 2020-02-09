const mongoose = require('mongoose');

const BotUserSchema = new mongoose.Schema({
    chatId: Number,
    username: String
});

const BotUser = mongoose.model('botUser', BotUserSchema);

module.exports = BotUser;
