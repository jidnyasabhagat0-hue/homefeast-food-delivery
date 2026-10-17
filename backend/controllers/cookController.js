const CookProfile = require('../models/CookProfile');
const MenuItem = require('../models/MenuItem');
const MealPlan = require('../models/MealPlan');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');

// @desc    Get all approved cooks with search & filter
// @route   GET /api/cooks
exports.getCooks = async (req, res, next) => {
  try {
    const { search, cuisine, mealType, area, maxPrice, minRating, sort } = req.query;
    let query = { approvalStatus: 'approved' };

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (cuisine && cuisine !== 'All') {
      query.cuisines = cuisine;
    }

    if (mealType && mealType !== 'All') {
      query.mealTypes = mealType;
    }

    if (area && area !== 'All') {
      query.serviceAreas = { $regex: area, $options: 'i' };
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (maxPrice) {
      query.startingPrice = { $lte: Number(maxPrice) };
    }

    let sortOptions = { rating: -1 };
    if (sort === 'price_asc') sortOptions = { startingPrice: 1 };
    if (sort === 'price_desc') sortOptions = { startingPrice: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'reviews') sortOptions = { reviewCount: -1 };

    const cooks = await CookProfile.find(query).populate('userId', 'name email phone avatar').sort(sortOptions);
    res.json({ success: true, count: cooks.length, data: cooks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single cook profile with menu, plans & reviews
// @route   GET /api/cooks/:id
exports.getCookById = async (req, res, next) => {
  try {
    const cook = await CookProfile.findById(req.params.id).populate('userId', 'name email phone avatar');
    if (!cook) return res.status(404).json({ success: false, message: 'Cook profile not found' });

    const menuItems = await MenuItem.find({ cookId: cook._id });
    const mealPlans = await MealPlan.find({ cookId: cook._id });
    const reviews = await Review.find({ cookId: cook._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        cook,
        menuItems,
        mealPlans,
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Cook Profile (Cook only)
// @route   PUT /api/cooks/my-profile
exports.updateMyProfile = async (req, res, next) => {
  try {
    let cook = await CookProfile.findOne({ userId: req.user.id });
    if (!cook) return res.status(404).json({ success: false, message: 'Cook profile not found' });

    const fieldsToUpdate = [
      'businessName', 'tagline', 'description', 'cuisines', 'mealTypes',
      'serviceAreas', 'deliveryTimings', 'startingPrice', 'isAcceptingOrders', 'coverImage', 'profilePhoto'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) cook[field] = req.body[field];
    });

    await cook.save();
    res.json({ success: true, message: 'Cook profile updated', data: cook });
  } catch (error) {
    next(error);
  }
};

// @desc    Cook Dashboard Overview stats
// @route   GET /api/cooks/dashboard/stats
exports.getCookStats = async (req, res, next) => {
  try {
    const cook = await CookProfile.findOne({ userId: req.user.id });
    if (!cook) return res.status(404).json({ success: false, message: 'Cook profile not found' });

    const totalOrders = await Order.countDocuments({ cookId: cook._id });
    const pendingOrders = await Order.countDocuments({ cookId: cook._id, orderStatus: 'Pending' });
    const activeSubscriptions = await Subscription.countDocuments({ cookId: cook._id, status: 'Active' });

    const completedOrders = await Order.find({ cookId: cook._id, orderStatus: 'Completed' });
    const completedSubs = await Subscription.find({ cookId: cook._id, status: { $in: ['Active', 'Completed'] } });

    const orderEarnings = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const subEarnings = completedSubs.reduce((sum, sub) => sum + (sub.totalAmount || 0), 0);
    const totalEarnings = orderEarnings + subEarnings;

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        activeSubscriptions,
        totalEarnings,
        rating: cook.rating,
        reviewCount: cook.reviewCount,
        approvalStatus: cook.approvalStatus
      }
    });
  } catch (error) {
    next(error);
  }
};
