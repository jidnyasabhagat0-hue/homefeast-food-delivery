const MenuItem = require('../models/MenuItem');
const CookProfile = require('../models/CookProfile');

// Get menu items by cook ID
exports.getMenuByCook = async (req, res, next) => {
  try {
    const items = await MenuItem.find({ cookId: req.params.cookId });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

// Add menu item (Cook)
exports.addMenuItem = async (req, res, next) => {
  try {
    const cook = await CookProfile.findOne({ userId: req.user.id });
    if (!cook) return res.status(404).json({ success: false, message: 'Cook profile required' });

    const { name, description, category, mealType, price, image, calories, portionSize, isSpecialty } = req.body;
    const item = await MenuItem.create({
      cookId: cook._id,
      name,
      description,
      category,
      mealType,
      price,
      image,
      calories,
      portionSize,
      isSpecialty
    });

    res.status(201).json({ success: true, message: 'Dish added to menu', data: item });
  } catch (error) {
    next(error);
  }
};

// Update menu item (Cook)
exports.updateMenuItem = async (req, res, next) => {
  try {
    const cook = await CookProfile.findOne({ userId: req.user.id });
    let item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });

    if (item.cookId.toString() !== cook._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this dish' });
    }

    item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Menu item updated', data: item });
  } catch (error) {
    next(error);
  }
};

// Delete menu item (Cook)
exports.deleteMenuItem = async (req, res, next) => {
  try {
    const cook = await CookProfile.findOne({ userId: req.user.id });
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });

    if (item.cookId.toString() !== cook._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this dish' });
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Dish removed from menu' });
  } catch (error) {
    next(error);
  }
};
