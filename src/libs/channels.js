const Channel = require('../models/Channel.js');

async function addNewChannelDB(name) {
	await Channel.deleteMany({});
	const channel = new Channel({ name });
	await channel.save();
}

async function getChannelDB() {
	const channel = await Channel.findOne({});
	return channel;
}

module.exports = {
	addNewChannelDB,
	getChannelDB
}