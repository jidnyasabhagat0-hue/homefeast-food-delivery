const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  complaintNumber: { type: String, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'CookProfile', required: true },
  subject: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Open', 'Under Review', 'Resolved', 'Dismissed'], 
    default: 'Open' 
  },
  resolution: { type: String, default: '' },
  resolvedAt: { type: Date }
}, { timestamps: true });

ComplaintSchema.pre('save', function(next) {
  if (!this.complaintNumber) {
    this.complaintNumber = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
