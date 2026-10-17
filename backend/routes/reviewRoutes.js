const express = require('express');
const router = express.Router();
const { createReview, getCookReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/cook/:cookId', getCookReviews);
router.post('/', protect, createReview);

module.exports = router;
