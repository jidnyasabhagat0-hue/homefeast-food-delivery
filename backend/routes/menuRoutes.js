const express = require('express');
const router = express.Router();
const { getMenuByCook, addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/cook/:cookId', getMenuByCook);
router.post('/', protect, authorize('cook'), addMenuItem);
router.put('/:id', protect, authorize('cook'), updateMenuItem);
router.delete('/:id', protect, authorize('cook'), deleteMenuItem);

module.exports = router;
