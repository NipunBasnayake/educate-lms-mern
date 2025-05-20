const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, forgotPasswordOtp, resetPasswordOtp } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/forgot-password-otp', forgotPasswordOtp);
router.post('/reset-password-otp', resetPasswordOtp);

module.exports = router;