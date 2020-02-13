const BotUser = require('../models/BotUser');
const Duplex = require('stream').Duplex;
const { findAllReceiversDB } = require('../libs/receivers.js');
const {	getChannelDB } = require('../libs/channels.js');
const { Markup } = require('telegraf');
const translatte = require('translatte');

/**
 * Function that converts buffer
 * to writable stream
 */
function bufferToStream(buffer) {
	const stream = new Duplex();
	stream.push(buffer);
	stream.push(null);
	return stream;
}

async function buildMessage({ comment, phone, whatsApp, viber, telegram }) {
  	const link = `https://api.whatsapp.com/send?phone=${phone}`;
	const english = (await translatte(comment, { to: 'en' })).text;

	let message = `Комментарий: ${comment}\n`;
	message += `Comment: ${english}\n`;
  	message += `Телефон | Phone: ${phone}\n`;
	message += `Как можно связаться: | Contacts:\n`;

	message += (telegram ? `✅` : `❌`) + ' Telegram\n';
	message += (viber ? `✅` : `❌`) + ' Viber\n';
	message += (whatsApp ? `✅ WhatsApp 👉 ${link}\n` : `❌ WhatsApp`);

	const keyboard = Markup.inlineKeyboard([
	  Markup.callbackButton('Обработано ✅', 'done')
	]);

	return { message, keyboard };
}

/**
 * Function that sends message
 * to the channel
 */
async function sendMessageToChannel(bot, message, keyboard, photos = []) {
	// Get channel
	const channel = await getChannelDB();
	const channelName = channel.name.startsWith('@') ? channel.name.slice(1) : channel.name;
	// Max length of the photos array is 10 items
	photos = photos.length > 10 ? photos.slice(0, 10) : photos;
	const data = [];
	for (const photo of photos) {
		data.push({
			type: 'photo',
			media: { source: bufferToStream(photo) }
		});
	}
	try {
		if (data.length) {
			const media = await bot.telegram.sendMediaGroup('-100' + channelName, data, {
			  disable_web_page_preview: true
			});

			await bot.telegram.sendMessage('-100' + channelName, message, {
			  parse_mode: 'html',
			  reply_markup: keyboard,
			  disable_web_page_preview: true
			});
			return media.map(item => item.photo[0].file_id);
		} else {
		  	await bot.telegram.sendMessage('-100' + channelName, message, {
				parse_mode: 'html',
			  	reply_markup: keyboard,
			  	disable_web_page_preview: true
			});
			return [];
		}
	} catch (err) {
		console.error(err.message);
		err.message = 'Ошибка: не удалось отправить сообщение в канал';
		console.log('err')
		throw err;
	}
}

/**
 * Function that sends message
 * to every receiver (receivers)
 * is the array of usernames
 */
async function sendMessageToReceivers(bot, message, photos = []) {
	// Max length of the photos array is 10 items
	photos = photos.length > 10 ? photos.slice(0, 10) : photos;
	// Create data array
	const data = [];
	// Push every photo to data array
	for (const photo of photos) {
		data.push({
			type: 'photo',
			media: photo
		});
	}
	if (data.length) {
		data[data.length - 1].caption = message;
		data[data.length - 1].parse_mode = 'html';
	}
	// Get receivers array
	const receivers = (await findAllReceiversDB()).map((receiver) => {
		const { username } = receiver;
		// Remove '@' char if it's presented
		return username.startsWith('@') ? username.slice(1) : username;
	});
	const botUsers = await BotUser.find({
		'username': { $in: receivers }
	});
	for (const botUser of botUsers) {
		// Get chatid of current receiver
		const { chatId } = botUser;

		if (data.length) {
		  	bot.telegram.sendMediaGroup(chatId, data, {
			  disable_web_page_preview: true
			});
		} else {
		  	bot.telegram.sendMessage(chatId, message, {
				parse_mode: 'html',
			  	disable_web_page_preview: true
			});
		}
	}
}

module.exports = {
	buildMessage,
	sendMessageToChannel,
	sendMessageToReceivers
};
