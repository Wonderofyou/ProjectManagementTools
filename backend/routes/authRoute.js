const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Đăng ký
router.post('/register', authController.signupController);

// Đăng nhập
router.post('/login', authController.loginController);

// Đăng xuất
router.post('/logout', authController.logoutController);

router.get('/profile', authController.profile);

module.exports = router;
