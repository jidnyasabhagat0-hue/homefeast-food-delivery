const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'CookProfile', required: true },
  name: { type: String, required: [true, 'Dish name is required'], trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Veg', 'Non-Veg', 'Jain', 'Vegan'], 
    required: true 
  },
  mealType: { 
    type: String, 
    enum: ['Breakfast', 'Lunch', 'Dinner', 'All-Day', 'Snacks'], 
    required: true 
  },
  price: { type: Number, required: true, min: [10, 'Price must be at least ₹10'] },
  image: { type: String, default: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' },
  availability: { type: Boolean, default: true },
  calories: { type: Number, default: 450 },
  portionSize: { type: String, default: 'Serves 1 (400g)' },
  isSpecialty: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
