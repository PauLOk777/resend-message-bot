const express = require('express');

const router = express.Router();
const handlers = require('../handlers/handlers');

router.get('/', handlers.authorizationPage);
router.post('/', handlers.authorization);
router.get('/home', handlers.homePage);
router.post('/home', handlers.sendInfo);
router.get('/admin', handlers.adminPage);
router.post('/admin/add/user', handlers.addUser);
router.get('/admin/add/receiver', handlers.addReceiver);
router.get('/admin/add/channel', handlers.addChannel);

module.exports = router;