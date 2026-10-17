const Complaint = require('../models/Complaint');
const Order = require('../models/Order');

exports.createComplaint = async (req, res, next) => {
  try {
    const { orderId, subject, description } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.customerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const complaint = await Complaint.create({
      customerId: req.user.id,
      orderId,
      cookId: order.cookId,
      subject,
      description,
      status: 'Open'
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted. HomeFeast support is reviewing your issue.',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ customerId: req.user.id })
      .populate('orderId', 'orderNumber totalAmount createdAt')
      .populate('cookId', 'businessName')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    next(error);
  }
};
