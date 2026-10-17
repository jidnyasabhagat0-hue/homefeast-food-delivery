const User = require('../models/User');
const CookProfile = require('../models/CookProfile');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const Complaint = require('../models/Complaint');

// @desc    Admin Platform KPIs
// @route   GET /api/admin/stats
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalCooks = await CookProfile.countDocuments({ approvalStatus: 'approved' });
    const pendingCooks = await CookProfile.countDocuments({ approvalStatus: 'pending' });
    const activeSubscriptions = await Subscription.countDocuments({ status: 'Active' });
    const totalOrders = await Order.countDocuments();
    const openComplaints = await Complaint.countDocuments({ status: { $in: ['Open', 'Under Review'] } });

    const allOrders = await Order.find({ orderStatus: 'Completed' });
    const allSubs = await Subscription.find({ status: { $in: ['Active', 'Completed'] } });

    const orderRevenue = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const subRevenue = allSubs.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const totalRevenue = orderRevenue + subRevenue;

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalCooks,
        pendingCooks,
        activeSubscriptions,
        totalOrders,
        openComplaints,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    let query = {};

    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.accountStatus = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (suspend / reactivate)
// @route   PUT /api/admin/users/:id/status
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { accountStatus: status }, { new: true });
    res.json({ success: true, message: `User account status updated to ${status}`, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending cook approval requests
// @route   GET /api/admin/cooks/pending
exports.getPendingCooks = async (req, res, next) => {
  try {
    const pendingCooks = await CookProfile.find({ approvalStatus: 'pending' })
      .populate('userId', 'name email phone createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: pendingCooks.length, data: pendingCooks });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject a cook
// @route   PUT /api/admin/cooks/:id/approval
exports.updateCookApproval = async (req, res, next) => {
  try {
    const { approvalStatus, verificationStatus } = req.body;
    const cook = await CookProfile.findById(req.params.id);
    if (!cook) return res.status(404).json({ success: false, message: 'Cook not found' });

    cook.approvalStatus = approvalStatus;
    if (verificationStatus) cook.verificationStatus = verificationStatus;
    if (approvalStatus === 'approved') {
      cook.verificationStatus = 'verified';
      await User.findByIdAndUpdate(cook.userId, { accountStatus: 'active' });
    }

    await cook.save();
    res.json({ success: true, message: `Cook profile marked as ${approvalStatus}`, data: cook });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints
// @route   GET /api/admin/complaints
exports.getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate('customerId', 'name email phone')
      .populate('cookId', 'businessName')
      .populate('orderId', 'orderNumber totalAmount')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve complaint
// @route   PUT /api/admin/complaints/:id/resolve
exports.resolveComplaint = async (req, res, next) => {
  try {
    const { status, resolution } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, resolution, resolvedAt: new Date() },
      { new: true }
    );

    res.json({ success: true, message: 'Complaint updated', data: complaint });
  } catch (error) {
    next(error);
  }
};
