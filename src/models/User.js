const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, 'Please provide full name'], trim: true },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: { type: String, required: [true, 'Please provide password'], minlength: 8, select: false },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, enum: ['agent','manager','landlord','property-manager','ceo','admin'], default: 'agent' },
  avatar: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  preferences: {
    notifications: { email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    theme: { type: String, enum: ['light','dark','auto'], default: 'dark' }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = require('mongoose').models.User || mongoose.model('User', userSchema);
