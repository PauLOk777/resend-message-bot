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
	findAllReceiversDB
} = require('../libs/receivers.js');

const {
	addNewChannelDB
} = require('../libs/channels.js');

const randomCookie = require('../libs/random.js');

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

		res.render('home.hbs', {
			title: 'Home',
			adminCheck
		});
	} catch (e) {
		console.error(e);
		res.status(404);
		return;	
	}
}

async function sendInfo(req, res) {
	console.log(req);
	res.redirect('/');
}

async function adminPage(req, res) {
	try {
		const currentSession = await findSessionId(req.cookies.resendBotId);
		if (!currentSession || !currentSession.logged || !currentSession.isAdmin) {
			res.redirect('/');
			return;
		}
		
		res.render('adminPanel.hbs', {
			title: 'Admin panel'
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
}