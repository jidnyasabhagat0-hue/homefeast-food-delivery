const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const CookProfile = require('../models/CookProfile');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'homefeast_jwt_super_secret_key_2026_dev_prod', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register a Customer
// @route   POST /api/auth/register-customer
exports.registerCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, password, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const addresses = address ? [address] : [];

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: 'customer',
      addresses
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a Home Cook / Tiffin Provider
// @route   POST /api/auth/register-cook
exports.registerCook = async (req, res, next) => {
  try {
    const { 
      name, email, phone, password, 
      businessName, description, cuisines, mealTypes, serviceAreas, fssaiNumber 
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: 'cook',
      accountStatus: 'pending' // New cooks require admin approval
    });

    const cookProfile = await CookProfile.create({
      userId: user._id,
      businessName: businessName || `${name}'s Kitchen`,
      description: description || 'Fresh homemade food cooked with love and traditional recipes.',
      cuisines: cuisines || ['North Indian', 'Homestyle'],
      mealTypes: mealTypes || ['Veg'],
      serviceAreas: serviceAreas || ['Andheri', 'Powai'],
      fssaiNumber: fssaiNumber || 'Pending registration',
      approvalStatus: 'pending',
      verificationStatus: 'unverified'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      message: 'Registration successful! Your cook profile has been submitted for admin approval.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cookProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    User Login (Customer, Cook, or Admin)
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.accountStatus === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by an administrator.' });
    }

    let cookProfile = null;
    if (user.role === 'cook') {
      cookProfile = await CookProfile.findOne({ userId: user._id });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        accountStatus: user.accountStatus,
        addresses: user.addresses,
        cookProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged In User
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    let cookProfile = null;
    if (user.role === 'cook') {
      cookProfile = await CookProfile.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        cookProfile
      }
    });
  } catch (error) {
    next(error);
  }
};
