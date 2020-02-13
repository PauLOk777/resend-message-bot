const SSL_PATH = '/*YOUR SSL DIR PATH*/';

module.exports = {
	MONGODB_URL: '/*MONGODB CONNECTION URL*/',
	TG_TOKEN: '/*TELEGRAM BOT TOKEN*/',
	PORT: {
		http: 80,
		https: 443
	},
	SSL: {
		keyPath: SSL_PATH + '/*PRIVATE KEY FILE NAME*/',
		certPath: SSL_PATH + '/*CERTIFICATE FILE NAME*/',
		chainPath: SSL_PATH + '/*CHAIN FILE NAME*/'
	}
};