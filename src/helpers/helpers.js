const BotUser = require('../models/BotUser');
const Duplex = require('stream').Duplex;
const { findAllReceiversDB } = require('../libs/receivers.js');
const {	getChannelDB } = require('../libs/channels.js');

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
 * to the channel
 */
async function sendMessageToChannel(bot, message, photos = []) {
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
			data[data.length - 1].caption = message;
			data[data.length - 1].parse_mode = 'html';
			const media = await bot.telegram.sendMediaGroup('-100' + channelName, data);
			return media.map(item => item.photo[0].file_id);
		} else {
			await bot.telegram.sendMessage('-100' + channelName, message, {
				parse_mode: 'html'
			});
			return [];
		}
	} catch (err) {
		console.error(err.message);
		err.message = 'Ошибка: не удалось отправить сообщение в канал';
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
	sendMessageToChannel,
	sendMessageToReceivers
};
