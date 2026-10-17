const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'CookProfile', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  tags: [{ type: String }] // e.g. "Hygienic packaging", "Authentic flavor"
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
