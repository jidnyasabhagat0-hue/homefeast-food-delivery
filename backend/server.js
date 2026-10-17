const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cookRoutes = require('./routes/cookRoutes');
const menuRoutes = require('./routes/menuRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const orderRoutes = require('./routes/orderRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'HomeFeast REST API',
    database: mongoose.connection.readyState === 1 ? 'mongodb' : 'in-memory-fallback',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// IN-MEMORY FALLBACK STORE (Active when MongoDB is offline)
// ============================================================================
let mockUsers = [
  {
    _id: 'u1',
    id: 'u1',
    name: 'Ananya Desai',
    email: 'ananya@example.com',
    phone: '9819283746',
    role: 'customer',
    accountStatus: 'active',
    addresses: [
      { id: 'a1', tag: 'Home', street: 'Flat 402, Green Acres', area: 'Powai', city: 'Mumbai', pincode: '400076', isDefault: true }
    ]
  },
  {
    _id: 'u2',
    id: 'u2',
    name: 'Sunita Sharma',
    email: 'chef.sunita@homefeast.in',
    phone: '9821345678',
    role: 'cook',
    accountStatus: 'active'
  },
  {
    _id: 'u3',
    id: 'u3',
    name: 'Priya Sen (Super Admin)',
    email: 'admin@homefeast.in',
    phone: '9820011223',
    role: 'admin',
    accountStatus: 'active'
  }
];

let mockCooks = [
  {
    _id: 'c1',
    id: 'c1',
    userId: 'u2',
    cookName: 'Sunita Sharma',
    businessName: "Sunita's Ghar Ka Khana",
    tagline: 'Authentic Punjabi & North Indian Ghar Ka Swad',
    description: 'Home chef with 15+ years of passion for cooking pure, wholesome North Indian meals. All rotis are hand-rolled fresh with desi cow ghee, low oil gravies, and zero artificial colors or preservatives.',
    cuisines: ['North Indian', 'Punjabi'],
    mealTypes: ['Veg', 'Non-Veg', 'Diet-Friendly'],
    serviceAreas: ['Andheri East', 'Powai', 'Vile Parle'],
    deliveryTimings: 'Lunch: 12:00 PM - 2:00 PM | Dinner: 7:30 PM - 9:30 PM',
    fssaiNumber: '21522001928471',
    yearsExp: 15,
    rating: 4.9,
    reviewCount: 128,
    startingPrice: 110,
    approvalStatus: 'approved',
    verificationStatus: 'verified',
    coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  },
  {
    _id: 'c2',
    id: 'c2',
    userId: 'u4',
    cookName: 'Meenakshi Iyer',
    businessName: 'Dakshin Rasoi Tiffins',
    tagline: 'Traditional Tamil Brahmin & Kerala Tiffin Meals',
    description: 'Pure vegetarian and Sattvic home kitchen. Fresh stone-ground batters, organic millets, freshly grated coconut sambar, and home-churned buttermilk.',
    cuisines: ['South Indian', 'Kerala'],
    mealTypes: ['Veg', 'Jain'],
    serviceAreas: ['Matunga', 'Dadar', 'Powai', 'Sion'],
    deliveryTimings: 'Breakfast: 7:30 AM | Lunch: 12:00 PM - 2:00 PM',
    fssaiNumber: '21521008892110',
    yearsExp: 18,
    rating: 4.8,
    reviewCount: 94,
    startingPrice: 95,
    approvalStatus: 'approved',
    verificationStatus: 'verified',
    coverImage: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
  },
  {
    _id: 'c3',
    id: 'c3',
    userId: 'u5',
    cookName: 'Sneha Patil',
    businessName: "Aaji Cha Swad (Grandmother's Taste)",
    tagline: 'Hearty Maharashtrian Tiffins & Bhakri Thalis',
    description: 'Bringing authentic flavors from Kolhapur and Pune. Hot Jowar Bhakris straight off the tawa, seasonal pitla, sprouted usal, and spicy home-ground masalas.',
    cuisines: ['Maharashtrian', 'Konkani'],
    mealTypes: ['Veg', 'Non-Veg'],
    serviceAreas: ['Thane', 'Mulund', 'Bhandup'],
    deliveryTimings: 'Lunch: 12:15 PM - 2:15 PM | Dinner: 7:45 PM - 9:45 PM',
    fssaiNumber: '21523004412903',
    yearsExp: 9,
    rating: 4.7,
    reviewCount: 76,
    startingPrice: 105,
    approvalStatus: 'approved',
    verificationStatus: 'verified',
    coverImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80'
  }
];

let mockMenu = [
  {
    _id: 'm1',
    id: 'm1',
    cookId: 'c1',
    name: 'Deluxe Homestyle Punjabi Thali',
    description: 'Dal Tadka, Shahi Paneer, Jeera Rice, 4 Fresh Phulkas with Ghee, Salad & Gulab Jamun',
    category: 'Veg',
    mealType: 'Lunch',
    price: 160,
    calories: 580,
    availability: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80'
  },
  {
    _id: 'm2',
    id: 'm2',
    cookId: 'c1',
    name: 'Grandmother Rajma Chawal Combo',
    description: 'Slow-cooked Jammu rajma in iron handi with fragrant Basmati rice, mint onion salad & roasted papad',
    category: 'Veg',
    mealType: 'Lunch',
    price: 130,
    calories: 490,
    availability: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80'
  },
  {
    _id: 'm3',
    id: 'm3',
    cookId: 'c1',
    name: 'Homestyle Tariwala Chicken Curry',
    description: 'Light, digestive home-style chicken curry cooked in mustard oil with 4 warm phulkas and lemon onion slices',
    category: 'Non-Veg',
    mealType: 'Dinner',
    price: 190,
    calories: 520,
    availability: true,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=500&q=80'
  }
];

let mockPlans = [
  {
    _id: 'p1',
    id: 'p1',
    cookId: 'c1',
    name: 'Daily Trial Tiffin (1 Day)',
    durationType: 'daily',
    mealsIncluded: ['Lunch'],
    price: 150,
    originalPrice: 180,
    mealsCount: 1,
    description: 'Sample one hearty homemade lunch before subscribing to longer plans.',
    features: ['1 Dal + 1 Sabzi + 4 Phulkas + Rice', 'Zero preservative guarantee', 'Delivery included']
  },
  {
    _id: 'p2',
    id: 'p2',
    cookId: 'c1',
    name: 'Weekly Working Pro Plan (6 Days)',
    durationType: 'weekly',
    mealsIncluded: ['Lunch'],
    price: 840,
    originalPrice: 990,
    mealsCount: 6,
    description: 'Monday through Saturday lunch delivered right to your office desk or home.',
    features: ['Rotating weekly menu', 'Daily variety of seasonal veggies', 'Pause or skip with 4 hours notice']
  },
  {
    _id: 'p3',
    id: 'p3',
    cookId: 'c1',
    name: 'Monthly Gold Tiffin (26 Days)',
    durationType: 'monthly',
    mealsIncluded: ['Lunch'],
    price: 3399,
    originalPrice: 4200,
    mealsCount: 26,
    description: 'Complete peace of mind for the whole month with our most popular home subscription.',
    features: ['26 wholesome home lunches', 'Free weekend dessert add-ons', 'Dedicated priority delivery slot', 'Save ₹800+']
  }
];

let mockOrders = [
  {
    _id: 'o1',
    id: 'o1',
    orderNumber: 'HF-928172',
    customerId: 'u1',
    customerName: 'Ananya Desai',
    cookId: 'c1',
    cookName: "Sunita's Ghar Ka Khana",
    items: [{ name: 'Deluxe Homestyle Punjabi Thali', quantity: 2, price: 160 }],
    itemsText: 'Deluxe Homestyle Punjabi Thali (x2)',
    deliverySlot: '12:30 PM - 1:30 PM',
    deliveryTimeSlot: '12:30 PM - 1:30 PM',
    deliveryAddress: 'Flat 402, Green Acres, Powai, Mumbai',
    totalAmount: 350,
    orderStatus: 'Completed',
    status: 'Completed',
    specialInstructions: 'Make rotis with less ghee and send extra salad.',
    createdAt: new Date().toISOString()
  }
];

let mockSubscriptions = [
  {
    _id: 's1',
    id: 's1',
    subNumber: 'HFSUB-81920',
    customerId: 'u1',
    customerName: 'Ananya Desai',
    cookId: 'c1',
    cookName: "Sunita's Ghar Ka Khana",
    planName: 'Monthly Gold Tiffin (26 Days)',
    durationType: 'monthly',
    deliverySlot: '12:30 PM - 1:30 PM',
    deliveryTimeSlot: '12:30 PM - 1:30 PM',
    deliveryAddress: 'Flat 402, Green Acres, Powai, Mumbai',
    totalAmount: 3399,
    status: 'Active',
    deliveredMeals: 14,
    totalMealsScheduled: 26,
    startDate: '2026-10-01'
  }
];

let mockReviews = [
  {
    _id: 'r1',
    id: 'r1',
    cookId: 'c1',
    orderId: 'o1',
    customerName: 'Ananya Desai',
    rating: 5,
    comment: 'Truly reminds me of mom’s food back home! The dal makhani was velvety without being oily, and the phulkas were soft.',
    createdAt: new Date().toISOString()
  }
];

let mockComplaints = [];

const fallbackRouter = express.Router();

fallbackRouter.post('/auth/login', (req, res) => {
  const { email } = req.body;
  const user = mockUsers.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || mockUsers[1];
  const cookProfile = mockCooks.find(c => c.userId === user._id || c.userId === user.id) || (user.role === 'cook' ? mockCooks[0] : null);
  
  res.json({
    success: true,
    token: 'mock_jwt_token_' + user._id,
    user: {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      accountStatus: user.accountStatus,
      addresses: user.addresses || [],
      cookProfile
    }
  });
});

fallbackRouter.get('/auth/me', (req, res) => {
  const user = mockUsers[1];
  const cookProfile = mockCooks.find(c => c.userId === user._id);
  res.json({ success: true, user: { ...user, cookProfile } });
});

fallbackRouter.post('/auth/register-customer', (req, res) => {
  const { name, email, phone, address } = req.body;
  const newUser = {
    _id: 'u_' + Date.now(),
    id: 'u_' + Date.now(),
    name,
    email,
    phone,
    role: 'customer',
    accountStatus: 'active',
    addresses: address ? [address] : []
  };
  mockUsers.push(newUser);
  res.status(201).json({ success: true, token: 'mock_token_' + newUser._id, user: newUser });
});

fallbackRouter.post('/auth/register-cook', (req, res) => {
  const { name, email, phone, businessName, serviceAreas, fssaiNumber } = req.body;
  const newUser = {
    _id: 'u_' + Date.now(),
    id: 'u_' + Date.now(),
    name,
    email,
    phone,
    role: 'cook',
    accountStatus: 'pending'
  };
  const newCook = {
    _id: 'c_' + Date.now(),
    id: 'c_' + Date.now(),
    userId: newUser._id,
    cookName: name,
    businessName: businessName || `${name}'s Kitchen`,
    description: 'Fresh homemade food prepared with hygiene and love.',
    cuisines: ['North Indian', 'Homestyle'],
    mealTypes: ['Veg'],
    serviceAreas: Array.isArray(serviceAreas) ? serviceAreas : [serviceAreas || 'Mumbai'],
    deliveryTimings: 'Lunch: 12:00 PM - 2:00 PM',
    fssaiNumber: fssaiNumber || 'Pending verification',
    yearsExp: 3,
    rating: 5.0,
    reviewCount: 0,
    startingPrice: 110,
    approvalStatus: 'pending',
    verificationStatus: 'unverified',
    coverImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  };
  mockUsers.push(newUser);
  mockCooks.push(newCook);
  res.status(201).json({
    success: true,
    token: 'mock_token_' + newUser._id,
    message: 'Registration submitted for admin approval',
    user: { ...newUser, cookProfile: newCook }
  });
});

fallbackRouter.get('/cooks', (req, res) => {
  const approved = mockCooks.filter(c => c.approvalStatus === 'approved');
  res.json({ success: true, count: approved.length, data: approved });
});

fallbackRouter.get('/cooks/:id', (req, res) => {
  const cook = mockCooks.find(c => c._id === req.params.id || c.id === req.params.id) || mockCooks[0];
  res.json({ success: true, data: cook });
});

fallbackRouter.get('/cooks/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalEarnings: 3909,
      pendingOrdersCount: 1,
      activeSubscribersCount: 1,
      totalOrdersCount: 3,
      avgRating: 4.9,
      reviewCount: 128
    }
  });
});

fallbackRouter.get('/menu/cook/:cookId', (req, res) => {
  const items = mockMenu.filter(m => m.cookId === req.params.cookId);
  res.json({ success: true, count: items.length, data: items.length ? items : mockMenu });
});

fallbackRouter.post('/menu', (req, res) => {
  const item = { _id: 'm_' + Date.now(), id: 'm_' + Date.now(), ...req.body, availability: true };
  mockMenu.push(item);
  res.status(201).json({ success: true, message: 'Item added', data: item });
});

fallbackRouter.get('/meal-plans/cook/:cookId', (req, res) => {
  const plans = mockPlans.filter(p => p.cookId === req.params.cookId);
  res.json({ success: true, count: plans.length, data: plans.length ? plans : mockPlans });
});

fallbackRouter.get('/orders', (req, res) => {
  res.json({ success: true, count: mockOrders.length, data: mockOrders });
});

fallbackRouter.post('/orders', (req, res) => {
  const order = {
    _id: 'o_' + Date.now(),
    id: 'o_' + Date.now(),
    orderNumber: 'HF-' + Math.floor(100000 + Math.random() * 900000),
    ...req.body,
    orderStatus: 'Pending',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  mockOrders.unshift(order);
  res.status(201).json({ success: true, message: 'Order created', data: order });
});

fallbackRouter.put('/orders/:id/status', (req, res) => {
  const o = mockOrders.find(x => x._id === req.params.id || x.id === req.params.id);
  if (o) {
    o.orderStatus = req.body.status;
    o.status = req.body.status;
  }
  res.json({ success: true, message: 'Order status updated', data: o });
});

fallbackRouter.get('/subscriptions', (req, res) => {
  res.json({ success: true, count: mockSubscriptions.length, data: mockSubscriptions });
});

fallbackRouter.post('/subscriptions', (req, res) => {
  const sub = {
    _id: 's_' + Date.now(),
    id: 's_' + Date.now(),
    subNumber: 'HFSUB-' + Math.floor(10000 + Math.random() * 90000),
    ...req.body,
    status: 'Active',
    deliveredMeals: 0
  };
  mockSubscriptions.unshift(sub);
  res.status(201).json({ success: true, message: 'Subscribed successfully', data: sub });
});

fallbackRouter.get('/reviews/cook/:cookId', (req, res) => {
  res.json({ success: true, count: mockReviews.length, data: mockReviews });
});

fallbackRouter.get('/complaints/my', (req, res) => {
  res.json({ success: true, count: mockComplaints.length, data: mockComplaints });
});

fallbackRouter.get('/admin/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      customers: mockUsers.filter(u => u.role === 'customer').length,
      cooks: mockCooks.filter(c => c.approvalStatus === 'approved').length,
      pendingCooks: mockCooks.filter(c => c.approvalStatus === 'pending').length,
      subscriptions: mockSubscriptions.length,
      totalOrders: mockOrders.length,
      openComplaints: mockComplaints.length,
      totalRevenue: 3909
    }
  });
});

fallbackRouter.get('/admin/users', (req, res) => {
  res.json({ success: true, count: mockUsers.length, data: mockUsers });
});

fallbackRouter.get('/admin/cooks/pending', (req, res) => {
  const pending = mockCooks.filter(c => c.approvalStatus === 'pending');
  res.json({ success: true, count: pending.length, data: pending });
});

fallbackRouter.put('/admin/cooks/:id/approval', (req, res) => {
  const cook = mockCooks.find(c => c._id === req.params.id || c.id === req.params.id);
  if (cook) {
    cook.approvalStatus = req.body.approvalStatus;
  }
  res.json({ success: true, message: 'Cook status updated', data: cook });
});

fallbackRouter.get('/admin/complaints', (req, res) => {
  res.json({ success: true, count: mockComplaints.length, data: mockComplaints });
});

// Middleware: Route to in-memory fallback if MongoDB is not connected
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  return fallbackRouter(req, res, next);
});

// Regular MongoDB Routes (used when MongoDB connects)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cooks', cookRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/homefeast';

// Server initialization
if (process.env.NODE_ENV !== 'test') {
  mongoose.set('bufferCommands', false); // Do not buffer queries if offline
  mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
    .then(() => {
      console.log(' Connected to MongoDB database successfully');
      app.listen(PORT, () => {
        console.log(` HomeFeast API server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error(' MongoDB connection failed:', err.message);
      console.log(` Running in API fallback mode on port ${PORT} (Zero-config in-memory database active)...`);
      app.listen(PORT, () => {
        console.log(` HomeFeast API server listening on port ${PORT}`);
      });
    });
}

module.exports = app;