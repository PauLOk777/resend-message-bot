const Receiver = require('../models/Receiver.js');

async function findAllReceiversDB() {
	const receivers = await Receiver.find({}, err => {
		if (err) throw new Error('Problem with find all receivers');
	});

	return receivers;
}

async function addNewReceiverDB(username) {
	const receiver = new Receiver({ username }, err => {
		if (err) throw new Error('Problem with adding receiver');
	});

	await receiver.save();
}

async function deleteReceiverDB(username) {
	await Receiver.deleteOne({ username }, err => {
		if (err) throw new Error('Some problem with deleting receiver');
	});
}

module.exports = {
	findAllReceiversDB,
	addNewReceiverDB,
	deleteReceiverDB
}