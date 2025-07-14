const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 小程序登录
router.post('/wx/mp-login', authController.wxMpLogin);
// App登录
router.post('/wx/app-login', authController.wxAppLogin);

module.exports = router; 