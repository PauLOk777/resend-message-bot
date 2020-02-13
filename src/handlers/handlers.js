const { promisify } = require('util');

const {
	addUserDB,
	checkUser,
	findUser,
	deleteUserDB,
	findAllUsersDB
} = require('../libs/users.js');

const {
	addSessionDB,
	findSessionId,
	findSessionLogin,
	updateSignIn,
	updateSignOut,
	deleteSessionDB
} = require('../libs/sessions.js');

const {
	findAllReceiversDB,
	addNewReceiverDB,
	deleteReceiverDB
} = require('../libs/receivers.js');

const {
	addNewChannelDB,
	getChannelDB
} = require('../libs/channels.js');

const {
	buildMessage,
	sendMessageToChannel,
	sendMessageToReceivers
} = require('../helpers/helpers');

const Bot = require('../init/bot');

const upload = require('../init/multer.js');

const generateKey = require('../libs/random.js');

async function authorizationPage(req, res) {
	try {
		const currentSession = await findSessionId(req.cookies.resendBotId);
		if (!currentSession || !currentSession.logged) {
			res.render('authorization.hbs', {
				title: 'Authorization'
			});
			return;
		}
		res.redirect('/home');
	} catch(e) {
		console.error(e);
		res.status(404);
		return;
	}
}

async function authorization(req, res) {
	try {
        const currentSessionById = await findSessionId(req.cookies.resendBotId);

        if (!currentSessionById || !currentSessionById.logged) {
            const { login, password } = req.body;

            const match = await checkUser(login, password);
            if (match) {
                const info = await updateSignIn(login);
                const currentSession = await findSessionLogin(login);
                res.cookie('resendBotId', currentSession.resendBotId);
                res.status(200);
                res.redirect('/home');
            } else {
                res.status(401);
                res.redirect('/');
            }
        } else {
            res.redirect('/home');
            return;
        }
    } catch (e) {
        console.error(e);
        res.status(400);
        res.redirect('/');
    }
}

async function homePage(req, res) {
	try {
		const currentSession = await findSessionId(req.cookies.resendBotId);
		if (!currentSession || !currentSession.logged) {
			res.redirect('/');
			return;
		}

		let adminCheck = false;
		if (currentSession.isAdmin) {
			adminCheck = true;
		}

		const { error } = req.query;
		res.render('home.hbs', {
			title: 'Home',
			adminCheck,
			error
		});
	} catch (e) {
		console.error(e);
		res.status(404);
		return;
	}
}

async function sendInfo(req, res) {
	try {
	  	await promisify(upload)(req, res);
		const bot = await Bot.getBot();
		const { message, keyboard } = await buildMessage(req.body);
		const photos = req.files.map(photo => photo.buffer);
		const media = await sendMessageToChannel(bot, message, keyboard, photos);
		sendMessageToReceivers(bot, message, media);
	  	res.redirect('/');
	} catch (err) {
		const url = encodeURI('/home?error=' + err.message);
		return res.redirect(url);
	}
}

async function adminPage(req, res) {
	try {
		const currentSession = await findSessionId(req.cookies.resendBotId);
		if (!currentSession || !currentSession.logged || !currentSession.isAdmin) {
			res.redirect('/');
			return;
		}

		const channel = await getChannelDB();

		res.render('adminPanel.hbs', {
			title: 'Admin panel',
			channel
		});
	} catch (e) {
		console.error(e);
		res.status(404);
		return;
	}
}

async function getInfoUsers(req, res) {
	try {
		const currentSession = await findSessionId(req.cookies.resendBotId);
		if (!currentSession || !currentSession.logged || !currentSession.isAdmin) {
			res.redirect('/');
			return;
		}

		const mainInfo = {};
		mainInfo.users = await findAllUsersDB();

		for (let i = 0; i < mainInfo.users.length; i++) {
			if (mainInfo.users[i].login == currentSession.login) {
				mainInfo.users[i] = 'Admin in panel';
			}
		}

		mainInfo.receivers = await findAllReceiversDB();
		res.send(mainInfo);

	} catch (e) {
		console.error(e);
		res.status(404);
		return;
	}
}

async function addUser(req, res) {
	try {
		const currentSession = await findSessionId(req.cookies.resendBotId);
		if (!currentSession || !currentSession.logged || !currentSession.isAdmin) {
			res.redirect('/');
			return;
		}

		const { login, password } = req.body;
		const key = generateKey(50);
		await addSessionDB(key, login);
		await addUserDB(login, password);
		res.redirect('/admin');

	} catch (e) {
		console.error(e);
		res.status(404);
		return;
	}
}

async function addReceiver(req, res) {
	try {
		const currentSession = await findSessionId(req.cookies.resendBotId);
		if (!currentSession || !currentSession.logged || !currentSession.isAdmin) {
			res.redirect('/');
			return;
		}

		await addNewReceiverDB(req.query.username);
		res.redirect('/admin');

	} catch (e) {
		console.error(e);
		res.status(404);
		return;
	}
}

async function addNewChannel(req, res) {
	try {
		const currentSession = await findSessionId(req.cookies.resendBotId);
		if (!currentSession || !currentSession.logged || !currentSession.isAdmin) {
			res.redirect('/');
			return;
		}

		await addNewChannelDB(req.query.name);
		res.redirect('/admin');

	} catch (e) {
		console.error(e);
		res.status(404);
		return;
	}
}

async function deleteUser(req, res) {
	try {
		const currentSession = await findSessionId(req.cookies.resendBotId);
		if (!currentSession || !currentSession.logged || !currentSession.isAdmin) {
			res.redirect('/');
			return;
		}

		await deleteUserDB(req.params.login);
		await deleteSessionDB(req.params.login);
		res.redirect('/admin');

	} catch (e) {
		console.error(e);
		res.status(404);
		return;
	}
}

async function deleteReceiver(req, res) {
	try {
		const currentSession = await findSessionId(req.cookies.resendBotId);
		if (!currentSession || !currentSession.logged || !currentSession.isAdmin) {
			res.redirect('/');
			return;
		}

		await deleteReceiverDB(req.params.username);
		res.redirect('/admin');

	} catch (e) {
		console.error(e);
		res.status(404);
		return;
	}
}

async function signOut(req, res) {
    const info = await updateSignOut(req.cookies.resendBotId);
    res.clearCookie('resendBotId').redirect('/');
}

module.exports = {
	authorizationPage,
	authorization,
	homePage,
	sendInfo,
	adminPage,
	addUser,
	addReceiver,
	addNewChannel,
	deleteUser,
	deleteReceiver,
	signOut,
	getInfoUsers
};
