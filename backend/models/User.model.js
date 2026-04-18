const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['subscriber', 'admin'], default: 'subscriber' },
    
    // Subscription
    subscription: {
      status: { type: String, enum: ['active', 'inactive', 'cancelled', 'lapsed'], default: 'inactive' },
      plan: { type: String, enum: ['monthly', 'yearly', null], default: null },
      startDate: { type: Date },
      endDate: { type: Date },
      renewalDate: { type: Date },
    },

    // Charity
    selectedCharity: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity', default: null },
    charityPercentage: { type: Number, default: 10, min: 10, max: 100 },

    // Profile
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    country: { type: String, default: '' },

    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Hide password in JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
