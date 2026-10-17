const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
  cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'CookProfile', required: true },
  name: { type: String, required: [true, 'Meal plan title is required'], trim: true },
  durationType: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly'], 
    required: true 
  },
  mealsIncluded: [{ type: String, enum: ['Breakfast', 'Lunch', 'Dinner'] }],
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  description: { type: String, required: true },
  features: [{ type: String }],
  availability: { type: Boolean, default: true },
  daysPerWeek: { type: Number, default: 6 } // e.g. Mon-Sat
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', MealPlanSchema);
