const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { promisify } = require('util');
const engine = require('../engine/engine.js');
const router = require('../router/router.js');
const config = require('../config/config.js');

const PORT = {
	http: config.PORT.http || 80,
	https: config.PORT.https || 443
};
const SSL = {
	key: fs.readFileSync(config.SSL.keyPath),
	cert: fs.readFileSync(config.SSL.certPath),
	ca: fs.readFileSync(config.SSL.chainPath)
};

const init = async function() {
    const app = express();
	
	// Redirect to HTTPS from HTTP
	app.use(async (req, res, next) => {
		if (req.secure) {
			await next();
		} else {
			const httpsPath = `https://${req.headers.host}${req.url}`;
			res.redirect(httpsPath);
		}
	});
	// Other middlewares
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use('/', router);

    engine.init(app);

    // Http server
	const httpServer = http.createServer(app);
	// Https server
	const httpsServer = https.createServer(SSL, app);

    await promisify(httpServer.listen).call(httpServer, config.PORT.http);
	await promisify(httpsServer.listen).call(httpsServer, config.PORT.https);

    console.log(`>>> Server has been running`);
};

module.exports = { init };
