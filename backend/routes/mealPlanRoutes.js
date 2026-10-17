const express = require('express');
const router = express.Router();
const { getPlansByCook, createPlan, updatePlan, deletePlan } = require('../controllers/mealPlanController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/cook/:cookId', getPlansByCook);
router.post('/', protect, authorize('cook'), createPlan);
router.put('/:id', protect, authorize('cook'), updatePlan);
router.delete('/:id', protect, authorize('cook'), deletePlan);

module.exports = router;
