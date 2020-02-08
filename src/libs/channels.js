const Channel = require('../models/Channel.js');

async function addNewChannelDB(name) {
	await Channel.deleteMany({});
	const channel = new Channel({ name });
	await channel.save();
}

module.exports = {
	addNewChannelDB
}