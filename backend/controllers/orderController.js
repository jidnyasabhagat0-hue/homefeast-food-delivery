const Order = require('../models/Order');
const CookProfile = require('../models/CookProfile');

// @desc    Create new Order (Customer)
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { cookId, items, deliveryAddress, deliveryDate, deliveryTimeSlot, specialInstructions, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please add at least one dish' });
    }

    const order = await Order.create({
      customerId: req.user.id,
      cookId,
      items,
      deliveryAddress,
      deliveryDate: deliveryDate || new Date(),
      deliveryTimeSlot,
      specialInstructions,
      totalAmount,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! The cook will review and accept your order.',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders (Customer gets their orders, Cook gets received orders)
// @route   GET /api/orders
exports.getOrders = async (req, res, next) => {
  try {
    let orders;
    if (req.user.role === 'customer') {
      orders = await Order.find({ customerId: req.user.id })
        .populate('cookId', 'businessName profilePhoto serviceAreas')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'cook') {
      const cook = await CookProfile.findOne({ userId: req.user.id });
      if (!cook) return res.status(404).json({ success: false, message: 'Cook profile not found' });
      orders = await Order.find({ cookId: cook._id })
        .populate('customerId', 'name phone email')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'admin') {
      orders = await Order.find()
        .populate('customerId', 'name email phone')
        .populate('cookId', 'businessName')
        .sort({ createdAt: -1 });
    }

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Cook or Admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Accepted', 'Preparing', 'Out for Delivery', 'Completed', 'Rejected', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = status;
    if (status === 'Completed') {
      order.paymentStatus = 'completed';
    }
    await order.save();

    res.json({ success: true, message: `Order marked as ${status}`, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (Customer can cancel if Pending)
// @route   PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.customerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (order.orderStatus !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled as preparation has begun.' });
    }

    order.orderStatus = 'Cancelled';
    order.cancellationReason = req.body.reason || 'Cancelled by customer';
    await order.save();

    res.json({ success: true, message: 'Order has been cancelled', data: order });
  } catch (error) {
    next(error);
  }
};
