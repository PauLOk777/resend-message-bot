const Receiver = require('../models/Receiver.js');

async function findAllReceiversDB() {
	const receivers = await Receiver.find({}, err => {
		if (err) throw new Error('Problem with find all receivers');
	});

	return receivers;
}

module.exports = {
	findAllReceiversDB,
}