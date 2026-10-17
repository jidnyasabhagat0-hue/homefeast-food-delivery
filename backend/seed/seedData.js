const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const CookProfile = require('../models/CookProfile');
const MenuItem = require('../models/MenuItem');
const MealPlan = require('../models/MealPlan');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const Review = require('../models/Review');
const Complaint = require('../models/Complaint');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/homefeast';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB. Clearing existing data...');

    await User.deleteMany({});
    await CookProfile.deleteMany({});
    await MenuItem.deleteMany({});
    await MealPlan.deleteMany({});
    await Order.deleteMany({});
    await Subscription.deleteMany({});
    await Review.deleteMany({});
    await Complaint.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    // 1. Create Admin
    const admin = await User.create({
      name: 'Priya Sen (Super Admin)',
      email: 'admin@homefeast.in',
      phone: '9820011223',
      passwordHash: adminPasswordHash,
      role: 'admin',
      accountStatus: 'active'
    });

    // 2. Create Customers
    const customer1 = await User.create({
      name: 'Ananya Desai',
      email: 'ananya@example.com',
      phone: '9819283746',
      passwordHash,
      role: 'customer',
      addresses: [
        {
          tag: 'Home',
          street: 'Flat 402, Green Acres, Powai',
          area: 'Powai',
          city: 'Mumbai',
          pincode: '400076',
          landmark: 'Opposite Hiranandani Hospital',
          isDefault: true
        },
        {
          tag: 'Work',
          street: 'Tech Park, Tower B, 6th Floor',
          area: 'Andheri East',
          city: 'Mumbai',
          pincode: '400069',
          landmark: 'Near Chakala Metro',
          isDefault: false
        }
      ]
    });

    const customer2 = await User.create({
      name: 'Rahul Mehta',
      email: 'rahul@example.com',
      phone: '9876543210',
      passwordHash,
      role: 'customer',
      addresses: [
        {
          tag: 'Home',
          street: 'Flat 12, Sagar Darshan, Bandra West',
          area: 'Bandra',
          city: 'Mumbai',
          pincode: '400050',
          landmark: 'Near Mehboob Studio',
          isDefault: true
        }
      ]
    });

    // 3. Create Cooks
    // Cook 1: Sunita Sharma (North Indian, Approved & Verified)
    const cookUser1 = await User.create({
      name: 'Sunita Sharma',
      email: 'chef.sunita@homefeast.in',
      phone: '9821345678',
      passwordHash,
      role: 'cook',
      accountStatus: 'active'
    });

    const cookProfile1 = await CookProfile.create({
      userId: cookUser1._id,
      businessName: "Sunita's Ghar Ka Khana",
      tagline: 'Authentic Punjabi & North Indian Ghar Ka Swad',
      description: 'Home chef with 15+ years of passion for cooking pure, wholesome North Indian meals. All rotis are hand-rolled fresh with desi cow ghee, low oil gravies, and zero artificial colors or preservatives.',
      cuisines: ['North Indian', 'Punjabi', 'Homestyle'],
      mealTypes: ['Veg', 'Non-Veg', 'Diet-Friendly'],
      serviceAreas: ['Andheri East', 'Andheri West', 'Powai', 'Vile Parle'],
      deliveryTimings: {
        breakfast: '7:30 AM - 9:00 AM',
        lunch: '12:00 PM - 2:00 PM',
        dinner: '7:30 PM - 9:30 PM'
      },
      coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
      profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      fssaiNumber: '21522001928471',
      yearsOfExperience: 14,
      verificationStatus: 'verified',
      approvalStatus: 'approved',
      rating: 4.9,
      reviewCount: 128,
      startingPrice: 110
    });

    // Cook 2: Meenakshi Iyer (South Indian, Approved & Verified)
    const cookUser2 = await User.create({
      name: 'Meenakshi Iyer',
      email: 'chef.meenakshi@homefeast.in',
      phone: '9833445566',
      passwordHash,
      role: 'cook',
      accountStatus: 'active'
    });

    const cookProfile2 = await CookProfile.create({
      userId: cookUser2._id,
      businessName: 'Dakshin Rasoi Tiffins',
      tagline: 'Traditional Tamil Brahmin & Kerala Tiffin Meals',
      description: 'Pure vegetarian and Sattvic home kitchen. Fresh stone-ground batters, organic millets, freshly grated coconut sambar, and home-churned buttermilk prepared in brass and clay cookware.',
      cuisines: ['South Indian', 'Kerala', 'Tamil Brahmin'],
      mealTypes: ['Veg', 'Jain'],
      serviceAreas: ['Matunga', 'Dadar', 'Sion', 'Powai', 'Chembur'],
      deliveryTimings: {
        breakfast: '7:00 AM - 8:30 AM',
        lunch: '11:45 AM - 1:45 PM',
        dinner: '7:00 PM - 9:00 PM'
      },
      coverImage: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
      profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      fssaiNumber: '21521008892110',
      yearsOfExperience: 18,
      verificationStatus: 'verified',
      approvalStatus: 'approved',
      rating: 4.8,
      reviewCount: 94,
      startingPrice: 95
    });

    // Cook 3: Sneha Patil (Maharashtrian, Approved & Verified)
    const cookUser3 = await User.create({
      name: 'Sneha Patil',
      email: 'chef.sneha@homefeast.in',
      phone: '9892019283',
      passwordHash,
      role: 'cook',
      accountStatus: 'active'
    });

    const cookProfile3 = await CookProfile.create({
      userId: cookUser3._id,
      businessName: "Aaji Cha Swad (Grandmother's Taste)",
      tagline: 'Hearty Maharashtrian Tiffins & Bhakri Thalis',
      description: 'Bringing authentic flavors from Kolhapur and Pune. Hot Jowar Bhakris straight off the tawa, seasonal pitla, sprouted usal, and spicy home-ground masalas with fresh sol kadhi.',
      cuisines: ['Maharashtrian', 'Konkani', 'Homestyle'],
      mealTypes: ['Veg', 'Non-Veg'],
      serviceAreas: ['Thane', 'Mulund', 'Bhandup', 'Ghatkopar'],
      deliveryTimings: {
        breakfast: '8:00 AM - 9:30 AM',
        lunch: '12:15 PM - 2:15 PM',
        dinner: '7:45 PM - 9:45 PM'
      },
      coverImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
      profilePhoto: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
      fssaiNumber: '21523004412903',
      yearsOfExperience: 9,
      verificationStatus: 'verified',
      approvalStatus: 'approved',
      rating: 4.7,
      reviewCount: 76,
      startingPrice: 105
    });

    // Cook 4: Rajesh Verma (Pending Approval)
    const cookUser4 = await User.create({
      name: 'Rajesh Verma',
      email: 'chef.rajesh@homefeast.in',
      phone: '9867512340',
      passwordHash,
      role: 'cook',
      accountStatus: 'pending'
    });

    await CookProfile.create({
      userId: cookUser4._id,
      businessName: 'Dilli Tiffin House',
      tagline: 'Delhi Style Rajma Chawal & Paratha Tiffins',
      description: 'Specializing in Old Delhi style gravies, sattu parathas, and light digestive tiffins for working professionals and students.',
      cuisines: ['North Indian', 'Bihari'],
      mealTypes: ['Veg', 'Non-Veg'],
      serviceAreas: ['Malad', 'Kandivali', 'Goregaon'],
      fssaiNumber: 'Applied - Ack #918237',
      approvalStatus: 'pending',
      verificationStatus: 'unverified'
    });

    // 4. Create Menu Items for Sunita
    await MenuItem.insertMany([
      {
        cookId: cookProfile1._id,
        name: 'Deluxe Homestyle Punjabi Thali',
        description: 'Dal Tadka, Shahi Paneer, Jeera Rice, 4 Fresh Phulkas with Ghee, Salad & Gulab Jamun',
        category: 'Veg',
        mealType: 'Lunch',
        price: 160,
        calories: 580,
        portionSize: 'Serves 1',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
        availability: true,
        isSpecialty: true
      },
      {
        cookId: cookProfile1._id,
        name: 'Grandmother Rajma Chawal Combo',
        description: 'Slow-cooked Jammu rajma cooked in iron handi served with fragrant Basmati rice and mint onion salad',
        category: 'Veg',
        mealType: 'Lunch',
        price: 130,
        calories: 490,
        portionSize: 'Serves 1 (450g)',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
        availability: true,
        isSpecialty: true
      },
      {
        cookId: cookProfile1._id,
        name: 'Aloo Gobi Matar with 4 Phulkas',
        description: 'Crispy cauliflower, potatoes and green peas tossed with ginger and freshly roasted spices, served with curd',
        category: 'Veg',
        mealType: 'Dinner',
        price: 120,
        calories: 410,
        portionSize: 'Serves 1',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        cookId: cookProfile1._id,
        name: 'Homestyle Tariwala Chicken Curry',
        description: 'Light, digestive home-style chicken curry with 4 warm phulkas or steamed rice and sliced lemon',
        category: 'Non-Veg',
        mealType: 'Dinner',
        price: 190,
        calories: 520,
        portionSize: 'Serves 1 (3 pcs chicken)',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
        availability: true,
        isSpecialty: true
      }
    ]);

    // 5. Create Meal Plans for Sunita
    await MealPlan.insertMany([
      {
        cookId: cookProfile1._id,
        name: 'Daily Trial Tiffin (1 Day)',
        durationType: 'daily',
        mealsIncluded: ['Lunch'],
        price: 150,
        originalPrice: 180,
        description: 'Sample one hearty homemade lunch before subscribing to longer plans.',
        features: ['1 Dal + 1 Sabzi + 4 Phulkas + Rice', 'Zero preservative guarantee', 'Delivery included'],
        availability: true
      },
      {
        cookId: cookProfile1._id,
        name: 'Weekly Working Pro Plan (6 Days)',
        durationType: 'weekly',
        mealsIncluded: ['Lunch'],
        price: 840,
        originalPrice: 990,
        description: 'Monday through Saturday lunch delivered right to your office or home desk.',
        features: ['Rotating weekly menu', 'Daily variety of seasonal veggies', 'Pause or skip with 4 hours notice'],
        availability: true
      },
      {
        cookId: cookProfile1._id,
        name: 'Monthly Gold Tiffin (26 Days)',
        durationType: 'monthly',
        mealsIncluded: ['Lunch'],
        price: 3399,
        originalPrice: 4200,
        description: 'Complete peace of mind for the whole month with our most popular home subscription.',
        features: ['26 wholesome home lunches', 'Free weekend dessert add-ons', 'Dedicated priority delivery slot', 'Save ₹800+'],
        availability: true
      }
    ]);

    // 6. Create Menu Items & Plans for Meenakshi Iyer
    await MenuItem.insertMany([
      {
        cookId: cookProfile2._id,
        name: 'Traditional Tamil Brahmin Meals',
        description: 'Sambar, Rasam, Mor Kuzhambu, Poriyal, Kootu, Steamed Ponni Rice, 2 Appalams and Curd',
        category: 'Veg',
        mealType: 'Lunch',
        price: 140,
        calories: 480,
        portionSize: 'Serves 1',
        image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
        availability: true,
        isSpecialty: true
      },
      {
        cookId: cookProfile2._id,
        name: 'Steamed Idli & Medu Vada Combo',
        description: '4 soft fluffy jasmine idlis and 2 crispy medu vadas served with drumstick sambar and fresh coconut chutney',
        category: 'Veg',
        mealType: 'Breakfast',
        price: 95,
        calories: 380,
        portionSize: 'Serves 1',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
        availability: true
      }
    ]);

    await MealPlan.insertMany([
      {
        cookId: cookProfile2._id,
        name: 'Weekly Sattvic Lunch (6 Days)',
        durationType: 'weekly',
        mealsIncluded: ['Lunch'],
        price: 780,
        originalPrice: 900,
        description: 'Fresh South Indian vegetarian tiffin without onion or garlic upon request.',
        features: ['Pure ghee tempering', 'Digestive rasam every day', 'Fiber-rich poriyals'],
        availability: true
      },
      {
        cookId: cookProfile2._id,
        name: 'Monthly South Indian Feast (26 Days)',
        durationType: 'monthly',
        mealsIncluded: ['Lunch'],
        price: 3100,
        originalPrice: 3800,
        description: 'Nutritious homestyle South Indian lunches delivered daily in hot insulated casseroles.',
        features: ['26 days of varied menu', 'Includes buttermilk daily', 'Zero food waste packaging'],
        availability: true
      }
    ]);

    // 7. Create Orders for Ananya
    const order1 = await Order.create({
      orderNumber: 'HF-928172',
      customerId: customer1._id,
      cookId: cookProfile1._id,
      items: [
        {
          menuItemId: (await MenuItem.findOne({ cookId: cookProfile1._id }))._id,
          name: 'Deluxe Homestyle Punjabi Thali',
          quantity: 2,
          price: 160,
          category: 'Veg'
        }
      ],
      deliveryAddress: customer1.addresses[0],
      deliveryDate: new Date(),
      deliveryTimeSlot: '12:30 PM - 1:30 PM',
      totalAmount: 350,
      deliveryFee: 30,
      taxAmount: 0,
      paymentMethod: 'cod',
      paymentStatus: 'completed',
      orderStatus: 'Completed',
      specialInstructions: 'Please make rotis with less ghee and send extra salad.'
    });

    const order2 = await Order.create({
      orderNumber: 'HF-481920',
      customerId: customer1._id,
      cookId: cookProfile1._id,
      items: [
        {
          menuItemId: (await MenuItem.findOne({ name: 'Grandmother Rajma Chawal Combo' }))._id,
          name: 'Grandmother Rajma Chawal Combo',
          quantity: 1,
          price: 130,
          category: 'Veg'
        }
      ],
      deliveryAddress: customer1.addresses[0],
      deliveryDate: new Date(),
      deliveryTimeSlot: '1:00 PM - 2:00 PM',
      totalAmount: 160,
      deliveryFee: 30,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'Preparing',
      specialInstructions: 'Ring bell and leave at doorstep.'
    });

    // 8. Create Active Subscription for Ananya
    const monthlyPlan = await MealPlan.findOne({ cookId: cookProfile1._id, durationType: 'monthly' });
    await Subscription.create({
      subscriptionNumber: 'HFSUB-81920',
      customerId: customer1._id,
      cookId: cookProfile1._id,
      mealPlanId: monthlyPlan._id,
      planName: monthlyPlan.name,
      durationType: 'monthly',
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-10-31'),
      deliveryTimeSlot: '12:30 PM - 1:30 PM',
      deliveryAddress: customer1.addresses[0],
      totalAmount: 3399,
      status: 'Active',
      mealsDeliveredCount: 14,
      totalMealsScheduled: 26,
      specialInstructions: 'Spiciness mild to medium please.'
    });

    // 9. Create Review for Completed Order
    await Review.create({
      customerId: customer1._id,
      cookId: cookProfile1._id,
      orderId: order1._id,
      customerName: customer1.name,
      rating: 5,
      comment: 'Truly reminds me of mom’s food back home! The dal makhani was velvety without being oily, and the phulkas were soft even an hour after delivery.',
      tags: ['Zero Preservatives', 'Soft Phulkas', 'Hygienic Packaging']
    });

    // 10. Sample Complaint
    await Complaint.create({
      complaintNumber: 'TKT-7712',
      customerId: customer1._id,
      orderId: order1._id,
      cookId: cookProfile1._id,
      subject: 'Delivery delayed by 25 minutes during heavy rain',
      description: 'The tiffin arrived around 2:00 PM instead of 1:30 PM. The food was still warm, but please coordinate delivery timings earlier during monsoon.',
      status: 'Resolved',
      resolution: 'Apologized for delay due to sudden waterlogging in Powai. Added ₹50 courtesy discount credit to customer wallet.'
    });

    console.log('Database seeded successfully with authentic HomeFeast data!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}
