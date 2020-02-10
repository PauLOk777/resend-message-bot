const BotUser = require('../models/BotUser');
const Duplex = require('stream').Duplex;
const { findAllReceiversDB } = require('../libs/receivers.js');

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

function buildMessage({ comment, phone, whatsApp, viber, telegram }) {
	let message = `Комментарий: ${comment}\n`;
	message += `Телефон: ${phone}\n`;
	message += `Как можно связаться:\n`;

	message += (telegram ? `✅` : `❌`) + ' Telegram\n';
	message += (viber ? `✅` : `❌`) + ' Viber\n';
	message += (whatsApp ? `✅` : `❌`) + ' WhatsApp\n';

	return message;
}

/**
 * Function that sends message
 * to every receiver (receivers)
 * is the array of usernames
 */
async function sendMessageToReceivers(bot, message, photos = []) {
	// Get receivers array
	const receivers = (await findAllReceiversDB()).map((receiver) => {
		const { username } = receiver;
		// Remove '@' char if it's presented
		return username.startsWith('@') ? username.slice(1) : username;
	});
	// Max length of the photos array is 10 items
	photos = photos.length > 10 ? photos.slice(0, 10) : photos;
	const botUsers = await BotUser.find({
		'username': { $in: receivers }
	});
	const data = [];
	for (const photo of photos) {
		data.push({
			type: 'photo',
			media: { source: bufferToStream(photo) }
		});
	}
	if (data.length) {
		data[data.length - 1].caption = message;
		data[data.length - 1].parse_mode = 'html';
	}
	console.dir(data);
	for (const botUser of botUsers) {
		const { chatId } = botUser;
		const stream = bufferToStream(photos[0]);
		if (data.length) {
			await bot.telegram.sendMediaGroup(chatId, data);			
		} else {
			await bot.telegram.sendMessage(chatId, message, {
				parse_mode: 'html'
			});
		}
	}
}

module.exports = {
	buildMessage,
	sendMessageToReceivers
};
