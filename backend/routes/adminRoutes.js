const express = require('express');
const router = express.Router();
const {
  getAdminStats, getUsers, updateUserStatus, getPendingCooks,
  updateCookApproval, getComplaints, resolveComplaint
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/cooks/pending', getPendingCooks);
router.put('/cooks/:id/approval', updateCookApproval);
router.get('/complaints', getComplaints);
router.put('/complaints/:id/resolve', resolveComplaint);

module.exports = router;
