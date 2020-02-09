const express = require('express');

const router = express.Router();
const handlers = require('../handlers/handlers.js');

router.get('/', handlers.authorizationPage);
router.post('/', handlers.authorization);
router.get('/home', handlers.homePage);
router.post('/home', handlers.sendInfo);
router.get('/admin', handlers.adminPage);
router.post('/admin/add/user', handlers.addUser);
router.get('/admin/add/receiver', handlers.addReceiver);
router.get('/admin/add/channel', handlers.addNewChannel);
router.get('/admin/delete/user/:login', handlers.deleteUser);
router.get('/admin/delete/receiver/:username', handlers.deleteReceiver);
router.get('/sign/out', handlers.signOut);
router.get('/admin/get', handlers.getInfoUsers);

module.exports = router;