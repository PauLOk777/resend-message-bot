const Telegraf = require('telegraf');
const { TG_TOKEN } = require('../config/config');
const BotUser = require('../models/BotUser');

/**
 * Middleware that adds bot
 * users to the database
 */
async function addBotUser(ctx, next) {
	const chatId = ctx.from ? ctx.from.id : ctx.chat.id; 
	const username = ctx.from ? ctx.from.username : null;	
	await BotUser.findOneAndUpdate({ chatId }, {
			chatId,
			username
		}, { upsert: true, new: true });
	await next();
}

const Bot = {
	bot: null,
	getBot: async function() {
		return this.init();
	},
	init: async function () {
		if (this.bot) {
			return this.bot;
		}
		this.bot = new Telegraf(TG_TOKEN);

		this.bot.use(addBotUser);
		this.bot.start((ctx) => ctx.reply('Welcome'));

		await this.bot.launch();
		console.log('>>> Bot was launched')

		return this.bot;
	}
}

module.exports = Bot;
