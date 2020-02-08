const {
	addUserDB,
	checkUser,
	findUser,
	deleteUserDB
} = require('../libs/users.js');

const {
	addSessionDB,
	findSessionId,
	findSessionLogin,
	updateSignIn,
	updateSignOut,
	deleteSessionDB
} = require('../libs/sessions.js');

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
	
}

async function adminPage(req, res) {
	try {
		const currentSession = await findSessionId(req.cookies.resendBotId);
		if (!currentSession || !currentSession.logged || !currentSession.isAdmin) {
			res.redirect('/');
		}
		

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
		}
		

	} catch (e) {
		console.error(e);
		res.status(404);
		return;	
	}
}

async function addChannel(req, res) {
	try {
		const currentSession = await findSessionId(req.cookies.resendBotId);
		if (!currentSession || !currentSession.logged || !currentSession.isAdmin) {
			res.redirect('/');
		}
		

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
		}
		

	} catch (e) {
		console.error(e);
		res.status(404);
		return;	
	}
}

module.exports = {
	authorizationPage,
	authorization,
	homePage,
	sendInfo,
	adminPage,
	addUser,
	addReceiver,
	addChannel,
	deleteUser,
	deleteReceiver
}