async function authorizationPage(req, res) {
	try {
		const currentSession = await findSession(req.cookies.resendBot);
		if (!currentSession || !currentSession.logged) {
			res.redirect('/home');
			return;
		}
	} catch(e) {
		console.error(e);
		res.status(404);
		return;	
	}

	res.render('authorization.hbs', {
		title: 'Authorization'
	});
}

async function authorization(req, res) {

}

async function homePage(req, res) {

}

async function sendInfo(req, res) {
	
}

async function adminPage(req, res) {
	
}

async function addUser(req, res) {
	
}

async function addReceiver(req, res) {
	
}

async function addChannel(req, res) {
	
}

async function deleteUser(req, res) {
	
}

async function deleteReceiver(req, res) {
	
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