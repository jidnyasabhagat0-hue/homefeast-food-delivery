const MealPlan = require('../models/MealPlan');
const CookProfile = require('../models/CookProfile');

exports.getPlansByCook = async (req, res, next) => {
  try {
    const plans = await MealPlan.find({ cookId: req.params.cookId });
    res.json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    next(error);
  }
};

exports.createPlan = async (req, res, next) => {
  try {
    const cook = await CookProfile.findOne({ userId: req.user.id });
    if (!cook) return res.status(404).json({ success: false, message: 'Cook profile required' });

    const plan = await MealPlan.create({ ...req.body, cookId: cook._id });
    res.status(201).json({ success: true, message: 'Meal plan created', data: plan });
  } catch (error) {
    next(error);
  }
};

exports.updatePlan = async (req, res, next) => {
  try {
    const cook = await CookProfile.findOne({ userId: req.user.id });
    let plan = await MealPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Meal plan not found' });

    if (plan.cookId.toString() !== cook._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    plan = await MealPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Meal plan updated', data: plan });
  } catch (error) {
    next(error);
  }
};

exports.deletePlan = async (req, res, next) => {
  try {
    const cook = await CookProfile.findOne({ userId: req.user.id });
    const plan = await MealPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    if (plan.cookId.toString() !== cook._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await MealPlan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Meal plan removed' });
  } catch (error) {
    next(error);
  }
};
