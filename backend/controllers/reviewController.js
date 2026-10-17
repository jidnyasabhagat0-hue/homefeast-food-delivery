const Review = require('../models/Review');
const Order = require('../models/Order');
const CookProfile = require('../models/CookProfile');

exports.createReview = async (req, res, next) => {
  try {
    const { cookId, orderId, rating, comment, tags } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.customerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only review your own orders' });
    }

    if (order.orderStatus !== 'Completed') {
      return res.status(400).json({ success: false, message: 'Reviews can only be submitted for completed orders' });
    }

    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already submitted a review for this order' });
    }

    const review = await Review.create({
      customerId: req.user.id,
      cookId,
      orderId,
      customerName: req.user.name,
      rating: Number(rating),
      comment,
      tags: tags || []
    });

    // Update Cook rating & review count
    const allCookReviews = await Review.find({ cookId });
    const avgRating = (allCookReviews.reduce((sum, r) => sum + r.rating, 0) / allCookReviews.length).toFixed(1);

    await CookProfile.findByIdAndUpdate(cookId, {
      rating: Number(avgRating),
      reviewCount: allCookReviews.length
    });

    res.status(201).json({ success: true, message: 'Thank you! Your review has been published.', data: review });
  } catch (error) {
    next(error);
  }
};

exports.getCookReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ cookId: req.params.cookId }).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};
