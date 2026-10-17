const express = require('express');
const router = express.Router();
const { updateProfile, addAddress, deleteAddress, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.put('/profile', updateProfile);
router.post('/addresses', addAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.put('/change-password', changePassword);

module.exports = router;
