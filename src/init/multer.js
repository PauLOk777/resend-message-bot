const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({
	storage: multer.memoryStorage(),
	fileFilter: (req, file, callback) => {
		const ext = path.extname(file.originalname).toLowerCase();
		if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
			return callback(
				new Error('Ошибка: поддерживаются только jpeg, jpg, png картинки')
			);
		}
		callback(null, true);
	},
	limits: {
		fileSize: 1024 * 1024 * 10 // 10MB
	}
}).array('photos');

module.exports = upload;