const Subscription = require('../models/Subscription');
const CookProfile = require('../models/CookProfile');

exports.createSubscription = async (req, res, next) => {
  try {
    const { 
      cookId, mealPlanId, planName, durationType, startDate, endDate, 
      deliveryTimeSlot, deliveryAddress, totalAmount, totalMealsScheduled, specialInstructions, dietaryPreferences 
    } = req.body;

    const subscription = await Subscription.create({
      customerId: req.user.id,
      cookId,
      mealPlanId,
      planName,
      durationType,
      startDate,
      endDate,
      deliveryTimeSlot,
      deliveryAddress,
      totalAmount,
      totalMealsScheduled: totalMealsScheduled || (durationType === 'weekly' ? 6 : durationType === 'monthly' ? 26 : 1),
      specialInstructions,
      dietaryPreferences,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Subscription request submitted! Your cook will review and activate your tiffin service.',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubscriptions = async (req, res, next) => {
  try {
    let subs;
    if (req.user.role === 'customer') {
      subs = await Subscription.find({ customerId: req.user.id })
        .populate('cookId', 'businessName profilePhoto serviceAreas rating')
        .populate('mealPlanId')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'cook') {
      const cook = await CookProfile.findOne({ userId: req.user.id });
      if (!cook) return res.status(404).json({ success: false, message: 'Cook profile not found' });
      subs = await Subscription.find({ cookId: cook._id })
        .populate('customerId', 'name phone email')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'admin') {
      subs = await Subscription.find()
        .populate('customerId', 'name email phone')
        .populate('cookId', 'businessName')
        .sort({ createdAt: -1 });
    }

    res.json({ success: true, count: subs.length, data: subs });
  } catch (error) {
    next(error);
  }
};

exports.updateSubscriptionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });

    sub.status = status;
    await sub.save();

    res.json({ success: true, message: `Subscription status updated to ${status}`, data: sub });
  } catch (error) {
    next(error);
  }
};
