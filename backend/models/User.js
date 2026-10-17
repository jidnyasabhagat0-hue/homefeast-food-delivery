const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AddressSchema = new mongoose.Schema({
  tag: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  street: { type: String, required: true },
  area: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: 'Maharashtra' },
  pincode: { type: String, required: true },
  landmark: { type: String },
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please enter your name'], trim: true },
  email: { 
    type: String, 
    required: [true, 'Please enter your email'], 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: { 
    type: String, 
    required: [true, 'Please enter your phone number'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  passwordHash: { type: String, required: [true, 'Password is required'] },
  role: { 
    type: String, 
    enum: ['customer', 'cook', 'admin'], 
    default: 'customer' 
  },
  addresses: [AddressSchema],
  accountStatus: { 
    type: String, 
    enum: ['active', 'suspended', 'pending'], 
    default: 'active' 
  },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' }
}, { timestamps: true });

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
