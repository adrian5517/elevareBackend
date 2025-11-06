# Backend Implementation Guide
## Elevare Intelligence Platform - Node.js + Express.js + MongoDB

This guide provides complete backend implementation instructions for the Elevare Intelligence real estate management platform.

---

## 📋 Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Environment Setup](#environment-setup)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication & Authorization](#authentication--authorization)
7. [Core Features Implementation](#core-features-implementation)
8. [Real-time Features](#real-time-features)
9. [AI Integration Points](#ai-integration-points)
10. [Deployment](#deployment)

---

## 🛠️ Tech Stack

### Core Technologies
- **Runtime**: Node.js (v18+ recommended)
- **Framework**: Express.js v4.18+
- **Database**: MongoDB v6.0+ (with Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Real-time**: Socket.io v4.x
- **File Upload**: Multer + AWS S3 or Cloudinary
- **Email**: Nodemailer
- **Validation**: Joi or express-validator

### Additional Packages
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "joi": "^17.11.0",
    "socket.io": "^4.6.0",
    "multer": "^1.4.5-lts.1",
    "aws-sdk": "^2.1500.0",
    "nodemailer": "^6.9.7",
    "cron": "^3.1.6",
    "axios": "^1.6.2",
    "morgan": "^1.10.0",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js           # MongoDB connection
│   │   ├── jwt.js                # JWT configuration
│   │   └── aws.js                # AWS S3 config (optional)
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Property.js           # Property schema
│   │   ├── Lead.js               # Lead/Client schema
│   │   ├── Call.js               # Call transcription schema
│   │   ├── MoodEntry.js          # Psychospiritual tracking
│   │   ├── Task.js               # Task/Request schema
│   │   ├── Payment.js            # Payment/Rent schema
│   │   ├── Document.js           # Document vault schema
│   │   ├── Message.js            # Communication schema
│   │   └── Notification.js       # Notification schema
│   ├── controllers/
│   │   ├── authController.js     # Login/Signup/Logout
│   │   ├── userController.js     # User management
│   │   ├── propertyController.js # Property CRUD
│   │   ├── leadController.js     # Lead management
│   │   ├── callController.js     # Call tracking
│   │   ├── moodController.js     # Mood/EQ tracking
│   │   ├── taskController.js     # Task/CTA management
│   │   ├── paymentController.js  # Payment tracking
│   │   ├── documentController.js # Document management
│   │   └── dashboardController.js # Dashboard stats
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── users.js              # User routes
│   │   ├── properties.js         # Property routes
│   │   ├── leads.js              # Lead routes
│   │   ├── calls.js              # Call routes
│   │   ├── moods.js              # Mood tracking routes
│   │   ├── tasks.js              # Task routes
│   │   ├── payments.js           # Payment routes
│   │   ├── documents.js          # Document routes
│   │   └── dashboard.js          # Dashboard routes
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── roleCheck.js          # Role-based access
│   │   ├── validation.js         # Input validation
│   │   ├── errorHandler.js       # Global error handler
│   │   └── upload.js             # File upload middleware
│   ├── services/
│   │   ├── emailService.js       # Email notifications
│   │   ├── aiService.js          # AI integration (OpenAI/etc)
│   │   ├── analyticsService.js   # Data analytics
│   │   └── notificationService.js # Push notifications
│   ├── utils/
│   │   ├── generateToken.js      # JWT token generator
│   │   ├── validateInput.js      # Validation helpers
│   │   └── logger.js             # Logging utility
│   ├── sockets/
│   │   └── index.js              # Socket.io setup
│   └── app.js                    # Express app setup
├── .env                          # Environment variables
├── .env.example                  # Example env file
├── server.js                     # Entry point
└── package.json
```

---

## ⚙️ Environment Setup

### 1. Initialize Project
```bash
mkdir elevare-backend
cd elevare-backend
npm init -y
npm install express mongoose jsonwebtoken bcryptjs dotenv cors helmet express-rate-limit joi socket.io multer nodemailer morgan compression
npm install -D nodemon
```

### 2. Create `.env` File
```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=/api/v1

# Database
MONGODB_URI=mongodb://localhost:27017/elevare_intelligence
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elevare_intelligence?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# AWS S3 (Optional - for file storage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=elevare-documents

# AI Services (Optional)
OPENAI_API_KEY=your_openai_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🗄️ Database Schema

### User Model (`models/User.js`)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8,
    select: false // Don't return password by default
  },
  phone: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['agent', 'manager', 'landlord', 'property-manager', 'ceo', 'admin'],
    default: 'agent'
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'dark'
    }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Property Model (`models/Property.js`)
```javascript
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'Philippines' }
  },
  type: {
    type: String,
    enum: ['apartment', 'house', 'condo', 'commercial', 'land'],
    required: true
  },
  status: {
    type: String,
    enum: ['vacant', 'occupied', 'maintenance', 'listed'],
    default: 'vacant'
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rent: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'PHP' },
    dueDay: { type: Number, default: 1 }, // Day of month
    lastPaid: Date,
    nextDue: Date
  },
  lease: {
    startDate: Date,
    endDate: Date,
    renewalDate: Date,
    terms: String
  },
  features: {
    bedrooms: Number,
    bathrooms: Number,
    area: Number, // in sqm
    furnished: Boolean,
    parking: Boolean
  },
  images: [String],
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);
```

### Lead Model (`models/Lead.js`)
```javascript
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  email: String,
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'negotiating', 'won', 'lost'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social-media', 'walk-in', 'cold-call', 'other'],
    default: 'other'
  },
  interestedIn: {
    type: String,
    enum: ['buying', 'renting', 'selling'],
    required: true
  },
  budget: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'PHP' }
  },
  preferences: {
    location: [String],
    propertyType: [String],
    bedrooms: Number,
    timeline: String
  },
  notes: [String],
  lastContact: Date,
  nextFollowUp: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  vipLead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);
```

### Call Model (`models/Call.js`)
```javascript
const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  clientName: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  recordingUrl: String,
  transcription: {
    type: String,
    default: ''
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative', 'hesitant'],
    default: 'neutral'
  },
  aiAnalysis: {
    keyPoints: [String],
    detectedInterest: [String],
    missedOpportunities: [String],
    suggestedActions: [String],
    confidenceScore: Number // 1-10
  },
  coachFeedback: {
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    feedback: String,
    rating: Number, // 1-5
    strengths: [String],
    improvements: [String],
    correctiveScripts: [String],
    reviewedAt: Date
  },
  callDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Call', callSchema);
```

### Mood Entry Model (`models/MoodEntry.js`)
```javascript
const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entryType: {
    type: String,
    enum: ['morning', 'midday', 'after-call', 'end-of-day'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mood: {
    type: Number,
    min: 1,
    max: 10
  },
  energy: {
    type: Number,
    min: 1,
    max: 10
  },
  focus: {
    type: Number,
    min: 1,
    max: 10
  },
  confidence: {
    type: Number,
    min: 1,
    max: 5
  },
  empathy: {
    type: Number,
    min: 1,
    max: 5
  },
  satisfaction: {
    type: Number,
    min: 1,
    max: 5
  },
  intention: String,
  reflection: String,
  aiCorrelation: {
    insights: [String],
    patterns: [String],
    recommendations: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
```

### Task/Request Model (`models/Task.js`)
```javascript
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'escalate-vip',
      'request-script',
      'schedule-coaching',
      'complex-negotiation',
      'urgent-followup',
      'client-objection',
      'pricing-guidance',
      'technical-issue',
      'ask-ai',
      'human-coach',
      'other'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  response: String,
  resolvedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
```

### Payment Model (`models/Payment.js`)
```javascript
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'PHP'
  },
  type: {
    type: String,
    enum: ['rent', 'deposit', 'utility', 'maintenance', 'other'],
    default: 'rent'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: Date,
  paymentMethod: {
    type: String,
    enum: ['bank-transfer', 'gcash', 'paymaya', 'cash', 'check', 'other']
  },
  receiptUrl: String,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
```

### Document Model (`models/Document.js`)
```javascript
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'lease-agreement',
      'id',
      'ownership-document',
      'tax-declaration',
      'insurance',
      'inspection-report',
      'maintenance-record',
      'other'
    ],
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileName: String,
  fileSize: Number, // in bytes
  mimeType: String,
  expiryDate: Date,
  alertBefore: {
    type: Number,
    default: 30 // days before expiry
  },
  tags: [String],
  isConfidential: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
```

### Notification Model (`models/Notification.js`)
```javascript
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'task', 'payment', 'document'],
    default: 'info'
  },
  link: String,
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
```

---

## 🔐 Authentication & Authorization

### JWT Token Generation (`utils/generateToken.js`)
```javascript
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

module.exports = generateToken;
```

### Auth Middleware (`middleware/auth.js`)
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};
```

### Role Check Middleware (`middleware/roleCheck.js`)
```javascript
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
```

---

## 🌐 API Endpoints

### Auth Routes (`routes/auth.js`)
```javascript
const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

module.exports = router;
```

### Auth Controller (`controllers/authController.js`)
```javascript
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone, company, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      company,
      role: role || 'agent'
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user (include password)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        company: user.company,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // TODO: Send email with resetUrl
    // await sendEmail({ ... });

    res.status(200).json({
      success: true,
      message: 'Email sent',
      resetToken // Remove this in production
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### Property Routes (`routes/properties.js`)
```javascript
const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getProperties)
  .post(protect, authorize('landlord', 'property-manager', 'admin'), createProperty);

router
  .route('/:id')
  .get(protect, getProperty)
  .put(protect, authorize('landlord', 'property-manager', 'admin'), updateProperty)
  .delete(protect, authorize('landlord', 'admin'), deleteProperty);

module.exports = router;
```

### Lead Routes (`routes/leads.js`)
```javascript
const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getLeads)
  .post(protect, createLead);

router
  .route('/:id')
  .get(protect, getLead)
  .put(protect, updateLead)
  .delete(protect, deleteLead);

module.exports = router;
```

### Call Routes (`routes/calls.js`)
```javascript
const express = require('express');
const router = express.Router();
const {
  getCalls,
  getCall,
  createCall,
  addCoachFeedback,
  deleteCall
} = require('../controllers/callController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getCalls)
  .post(protect, createCall);

router
  .route('/:id')
  .get(protect, getCall)
  .delete(protect, deleteCall);

router.put('/:id/coach-feedback', protect, authorize('manager', 'ceo', 'admin'), addCoachFeedback);

module.exports = router;
```

### Mood Routes (`routes/moods.js`)
```javascript
const express = require('express');
const router = express.Router();
const {
  getMoodEntries,
  createMoodEntry,
  getDailyAnalysis,
  getWeeklyTrends
} = require('../controllers/moodController');
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getMoodEntries)
  .post(protect, createMoodEntry);

router.get('/daily-analysis', protect, getDailyAnalysis);
router.get('/weekly-trends', protect, getWeeklyTrends);

module.exports = router;
```

### Task Routes (`routes/tasks.js`)
```javascript
const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  resolveTask,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.put('/:id/resolve', protect, resolveTask);

module.exports = router;
```

### Dashboard Routes (`routes/dashboard.js`)
```javascript
const express = require('express');
const router = express.Router();
const {
  getAgentDashboard,
  getLandlordDashboard,
  getManagerDashboard
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/agent', protect, getAgentDashboard);
router.get('/landlord', protect, getLandlordDashboard);
router.get('/manager', protect, getManagerDashboard);

module.exports = router;
```

---

## 📊 Dashboard Controller Implementation

### Dashboard Controller (`controllers/dashboardController.js`)
```javascript
const User = require('../models/User');
const Lead = require('../models/Lead');
const Call = require('../models/Call');
const MoodEntry = require('../models/MoodEntry');
const Task = require('../models/Task');
const Property = require('../models/Property');
const Payment = require('../models/Payment');

// @desc    Get Agent Dashboard Data
// @route   GET /api/v1/dashboard/agent
// @access  Private
exports.getAgentDashboard = async (req, res) => {
  try {
    const agentId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get leads
    const activeLeads = await Lead.countDocuments({
      agent: agentId,
      status: { $in: ['new', 'contacted', 'qualified', 'negotiating'] }
    });

    // Get pending tasks
    const pendingTasks = await Task.countDocuments({
      agent: agentId,
      status: { $in: ['pending', 'in-progress'] }
    });

    // Get today's calls
    const todayCalls = await Call.find({
      agent: agentId,
      callDate: { $gte: today }
    }).populate('lead', 'clientName');

    // Get recent mood entry
    const recentMood = await MoodEntry.findOne({
      agent: agentId
    }).sort({ createdAt: -1 });

    // Calculate progress (example metric)
    const completedTasksToday = await Task.countDocuments({
      agent: agentId,
      status: 'completed',
      resolvedAt: { $gte: today }
    });
    const totalTasksToday = pendingTasks + completedTasksToday;
    const progress = totalTasksToday > 0 ? Math.round((completedTasksToday / totalTasksToday) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          progress,
          activeLeads,
          pendingTasks,
          todayCallsCount: todayCalls.length
        },
        recentCalls: todayCalls.slice(0, 5),
        recentMood,
        greeting: getTimeBasedGreeting()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get Landlord Dashboard Data
// @route   GET /api/v1/dashboard/landlord
// @access  Private
exports.getLandlordDashboard = async (req, res) => {
  try {
    const landlordId = req.user.id;
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get properties
    const totalProperties = await Property.countDocuments({ landlord: landlordId });
    const occupiedProperties = await Property.countDocuments({
      landlord: landlordId,
      status: 'occupied'
    });

    // Get payments
    const paidThisMonth = await Payment.countDocuments({
      landlord: landlordId,
      status: 'paid',
      paidDate: { $gte: thisMonth }
    });

    const overduePayments = await Payment.countDocuments({
      landlord: landlordId,
      status: 'overdue'
    });

    // Calculate income
    const monthlyIncome = await Payment.aggregate([
      {
        $match: {
          landlord: landlordId,
          status: 'paid',
          paidDate: { $gte: thisMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get upcoming renewals (within 60 days)
    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(today.getDate() + 60);

    const upcomingRenewals = await Property.find({
      landlord: landlordId,
      'lease.renewalDate': { $lte: sixtyDaysFromNow, $gte: today }
    }).populate('tenant', 'fullName email');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalProperties,
          occupiedProperties,
          vacantProperties: totalProperties - occupiedProperties,
          paidThisMonth,
          overduePayments,
          monthlyIncome: monthlyIncome.length > 0 ? monthlyIncome[0].total : 0
        },
        upcomingRenewals: upcomingRenewals.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get Manager Dashboard Data
// @route   GET /api/v1/dashboard/manager
// @access  Private
exports.getManagerDashboard = async (req, res) => {
  try {
    const managerId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get team members (agents under this manager)
    // Assuming you have a team/manager relationship in User model
    const teamAgents = await User.find({
      role: 'agent',
      // manager: managerId // Add this field to User model if needed
    });

    const agentIds = teamAgents.map(agent => agent._id);

    // Get team performance
    const totalLeads = await Lead.countDocuments({
      agent: { $in: agentIds }
    });

    const todayCalls = await Call.countDocuments({
      agent: { $in: agentIds },
      callDate: { $gte: today }
    });

    const pendingReviews = await Call.countDocuments({
      agent: { $in: agentIds },
      'coachFeedback.coachId': { $exists: false }
    });

    // Get recent calls needing review
    const callsNeedingReview = await Call.find({
      agent: { $in: agentIds },
      'coachFeedback.coachId': { $exists: false }
    })
      .populate('agent', 'fullName')
      .populate('lead', 'clientName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          teamSize: teamAgents.length,
          totalLeads,
          todayCalls,
          pendingReviews
        },
        callsNeedingReview
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
```

---

## 🤖 AI Integration Points

### AI Service (`services/aiService.js`)
```javascript
const axios = require('axios');

// Example using OpenAI API
class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1';
  }

  // Analyze call transcription
  async analyzeCall(transcription, duration) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an AI coach analyzing real estate sales calls. Provide insights on sentiment, key points, missed opportunities, and actionable suggestions.'
            },
            {
              role: 'user',
              content: `Analyze this call transcription (${duration} seconds):\n\n${transcription}\n\nProvide: 1) Sentiment, 2) Key points, 3) Detected interests, 4) Missed opportunities, 5) Suggested actions, 6) Confidence score (1-10)`
            }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const analysis = response.data.choices[0].message.content;
      
      // Parse the response (you may need to refine this based on actual response format)
      return this.parseCallAnalysis(analysis);
    } catch (error) {
      console.error('AI Analysis Error:', error.message);
      return null;
    }
  }

  parseCallAnalysis(analysis) {
    // Parse AI response into structured data
    // This is a simplified example - adjust based on your needs
    return {
      sentiment: 'neutral',
      keyPoints: [],
      detectedInterest: [],
      missedOpportunities: [],
      suggestedActions: [],
      confidenceScore: 7
    };
  }

  // Analyze mood patterns
  async analyzeMoodPatterns(moodEntries) {
    try {
      const data = moodEntries.map(entry => ({
        date: entry.date,
        mood: entry.mood,
        energy: entry.energy,
        confidence: entry.confidence
      }));

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an AI analyzing emotional and performance patterns. Identify correlations and provide actionable insights.'
            },
            {
              role: 'user',
              content: `Analyze these mood/performance entries:\n\n${JSON.stringify(data, null, 2)}\n\nProvide insights, patterns, and recommendations.`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        insights: [],
        patterns: [],
        recommendations: []
      };
    } catch (error) {
      console.error('AI Mood Analysis Error:', error.message);
      return null;
    }
  }

  // Generate script suggestions
  async generateScript(context) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert real estate sales coach. Generate professional, persuasive scripts.'
            },
            {
              role: 'user',
              content: `Generate a sales script for: ${context}`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI Script Generation Error:', error.message);
      return null;
    }
  }
}

module.exports = new AIService();
```

---

## 🔄 Real-time Features (Socket.io)

### Socket.io Setup (`sockets/index.js`)
```javascript
const socketIo = require('socket.io');

function initializeSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join user-specific room
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Real-time notification
    socket.on('send-notification', (data) => {
      io.to(`user_${data.userId}`).emit('notification', data.notification);
    });

    // Real-time task update
    socket.on('task-update', (data) => {
      io.to(`user_${data.userId}`).emit('task-updated', data.task);
    });

    // Real-time call update
    socket.on('call-logged', (data) => {
      // Notify manager/coach
      io.to(`user_${data.managerId}`).emit('new-call', data.call);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = initializeSocket;
```

---

## 🚀 Main Server Setup

### Express App (`app.js`)
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use('/api', limiter);

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/properties', require('./routes/properties'));
app.use('/api/v1/leads', require('./routes/leads'));
app.use('/api/v1/calls', require('./routes/calls'));
app.use('/api/v1/moods', require('./routes/moods'));
app.use('/api/v1/tasks', require('./routes/tasks'));
app.use('/api/v1/payments', require('./routes/payments'));
app.use('/api/v1/documents', require('./routes/documents'));
app.use('/api/v1/dashboard', require('./routes/dashboard'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

module.exports = app;
```

### Server Entry Point (`server.js`)
```javascript
const app = require('./src/app');
const mongoose = require('mongoose');
const http = require('http');
const initializeSocket = require('./src/sockets');
require('dotenv').config();

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);
app.set('io', io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
```

---

## 📤 Frontend Integration

### Example API Service (React - `src/services/api.js`)
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (userData) => api.post('/auth/register', userData);
export const getMe = () => api.get('/auth/me');

// Dashboard
export const getAgentDashboard = () => api.get('/dashboard/agent');
export const getLandlordDashboard = () => api.get('/dashboard/landlord');

// Leads
export const getLeads = () => api.get('/leads');
export const createLead = (leadData) => api.post('/leads', leadData);

// Calls
export const getCalls = () => api.get('/calls');
export const createCall = (callData) => api.post('/calls', callData);

// Moods
export const getMoodEntries = () => api.get('/moods');
export const createMoodEntry = (moodData) => api.post('/moods', moodData);

// Tasks
export const getTasks = () => api.get('/tasks');
export const createTask = (taskData) => api.post('/tasks', taskData);

export default api;
```

### Update Login.jsx
```javascript
// Add to Login.jsx
import { login } from '../services/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await login(email, password);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Redirect based on role
    const role = response.data.user.role;
    if (role === 'landlord') {
      navigate('/landlord');
    } else if (role === 'agent') {
      navigate('/agent');
    } else {
      navigate('/');
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Login failed');
  }
};
```

---

## 🧪 Testing

### Example Test (Jest + Supertest)
```javascript
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /api/v1/auth/register - should create new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '+639123456789',
        company: 'Test Company',
        role: 'agent'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('token');
  });

  test('POST /api/v1/auth/login - should login user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('token');
  });
});
```

---

## 🚢 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_production_jwt_secret_very_long_and_secure
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Options

#### 1. **Heroku**
```bash
# Install Heroku CLI
heroku create elevare-backend
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

#### 2. **DigitalOcean/AWS EC2**
```bash
# SSH into server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and setup
git clone your-repo
cd elevare-backend
npm install
pm2 start server.js --name elevare-api
pm2 save
pm2 startup
```

#### 3. **Vercel (Serverless)**
Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

---

## 📝 Next Steps

1. **Setup MongoDB** (Local or Atlas)
2. **Install dependencies** (`npm install`)
3. **Configure `.env`** file
4. **Run migrations** (if any)
5. **Start development server** (`npm run dev`)
6. **Test endpoints** with Postman/Thunder Client
7. **Integrate with frontend**
8. **Add AI features** (OpenAI integration)
9. **Implement file upload** (AWS S3/Cloudinary)
10. **Add email service** (SendGrid/Nodemailer)
11. **Setup cron jobs** (payment reminders, document expiry alerts)
12. **Write tests**
13. **Deploy to production**

---

## 🔗 Additional Resources

- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **JWT Best Practices**: https://jwt.io/introduction
- **Express.js Docs**: https://expressjs.com/
- **Socket.io Docs**: https://socket.io/docs/v4/
- **OpenAI API**: https://platform.openai.com/docs/

---

**Created for Elevare Intelligence Platform**
*Backend implementation guide - Node.js + Express.js + MongoDB*
