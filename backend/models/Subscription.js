const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  subscriptionNumber: { type: String, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'CookProfile', required: true },
  mealPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'MealPlan', required: true },
  planName: { type: String, required: true },
  durationType: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  deliveryTimeSlot: { type: String, required: true },
  deliveryAddress: {
    street: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Active', 'Paused', 'Completed', 'Cancelled', 'Rejected'], 
    default: 'Pending' 
  },
  mealsDeliveredCount: { type: Number, default: 0 },
  totalMealsScheduled: { type: Number, required: true },
  specialInstructions: { type: String, default: '' },
  dietaryPreferences: { type: String, default: 'Standard homemade spices' }
}, { timestamps: true });

SubscriptionSchema.pre('save', function(next) {
  if (!this.subscriptionNumber) {
    this.subscriptionNumber = 'HFSUB-' + Math.floor(10000 + Math.random() * 90000);
  }
  next();
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
