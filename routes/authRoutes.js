const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// H5扫码登录
router.post('/wx/qrcode', authController.getWxQrcode);
router.get('/wx/qrcode/status', authController.getWxQrcodeStatus);
router.get('/wx/qr-callback', authController.wxQrCallback);

// 小程序登录
router.post('/wx/mp-login', authController.wxMpLogin);
// App登录
router.post('/wx/app-login', authController.wxAppLogin);

module.exports = router; 