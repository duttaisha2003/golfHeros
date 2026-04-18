const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    logo: { type: String, default: '' },
    images: [{ type: String }],
    website: { type: String, default: '' },
    category: { type: String, default: 'General' },
    upcomingEvents: [
      {
        title: { type: String },
        date: { type: Date },
        location: { type: String },
        description: { type: String },
      },
    ],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    totalReceived: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Charity', charitySchema);
