const express = require('express');
const router = express.Router();
const { registerCustomer, registerCook, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register-customer', registerCustomer);
router.post('/register-cook', registerCook);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
