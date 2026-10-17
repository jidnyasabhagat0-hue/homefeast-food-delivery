const express = require('express');
const router = express.Router();
const { getCooks, getCookById, updateMyProfile, getCookStats } = require('../controllers/cookController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getCooks);
router.get('/dashboard/stats', protect, authorize('cook'), getCookStats);
router.put('/my-profile', protect, authorize('cook'), updateMyProfile);
router.get('/:id', getCookById);

module.exports = router;
