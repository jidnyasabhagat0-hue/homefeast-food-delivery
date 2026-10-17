const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  category: { type: String }
});

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'CookProfile', required: true },
  items: [OrderItemSchema],
  deliveryAddress: {
    street: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  deliveryDate: { type: Date, required: true },
  deliveryTimeSlot: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 30 },
  taxAmount: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['cod', 'pending'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'refunded'], default: 'pending' },
  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled', 'Rejected'], 
    default: 'Pending' 
  },
  specialInstructions: { type: String, default: '' },
  cancellationReason: { type: String }
}, { timestamps: true });

OrderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'HF-' + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
