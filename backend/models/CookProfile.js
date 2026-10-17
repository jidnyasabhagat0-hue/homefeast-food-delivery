const mongoose = require('mongoose');

const CookProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, required: [true, 'Kitchen / business name is required'], trim: true },
  tagline: { type: String, default: 'Pure homemade goodness prepared with love' },
  description: { type: String, required: [true, 'Bio/Description is required'] },
  coverImage: { type: String, default: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80' },
  profilePhoto: { type: String, default: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
  cuisines: [{ type: String }],
  mealTypes: [{ type: String, enum: ['Veg', 'Non-Veg', 'Jain', 'Vegan', 'Diet-Friendly'] }],
  serviceAreas: [{ type: String, required: true }],
  deliveryTimings: {
    breakfast: { type: String, default: '7:30 AM - 9:30 AM' },
    lunch: { type: String, default: '12:00 PM - 2:00 PM' },
    dinner: { type: String, default: '7:30 PM - 9:30 PM' }
  },
  fssaiNumber: { type: String, default: '21523000000000' },
  yearsOfExperience: { type: Number, default: 4 },
  verificationStatus: { 
    type: String, 
    enum: ['verified', 'unverified'], 
    default: 'unverified' 
  },
  approvalStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 0 },
  startingPrice: { type: Number, default: 99 },
  isAcceptingOrders: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('CookProfile', CookProfileSchema);
