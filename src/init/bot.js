const Telegraf = require('telegraf');
const { TG_TOKEN } = require('../config/config');
const BotUser = require('../models/BotUser')

async function addBotUser(ctx, next) {
    await BotUser.findOneAndUpdate({ chatId: ctx.from.id }, {
        chatId: ctx.from.id,
        username: ctx.from.username
      }, { upsert: true, new: true })
    await next()
}

async function init() {
  const bot = new Telegraf(TG_TOKEN);

  bot.use(addBotUser);
  bot.start((ctx) => ctx.reply('Welcome'));

  bot.launch().then(() => console.log('>>> Bot was launched'));
}

async function sendMessageToReceivers(bot, receivers) {
  // ...
}

module.exports = { init };
