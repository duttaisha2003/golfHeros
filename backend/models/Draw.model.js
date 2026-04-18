const mongoose = require('mongoose');

const winnerEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  matchType: { type: String, enum: ['5-match', '4-match', '3-match'] },
  prizeAmount: { type: Number },
  matchedNumbers: [Number],
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  proofImage: { type: String, default: '' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paidAt: { type: Date },
});

const drawSchema = new mongoose.Schema(
  {
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
    drawnNumbers: [{ type: Number }], // 5 numbers drawn
    drawType: { type: String, enum: ['random', 'algorithmic'], default: 'random' },
    status: { type: String, enum: ['draft', 'simulation', 'published'], default: 'draft' },
    
    // Prize pools
    totalPool: { type: Number, default: 0 },
    pool5Match: { type: Number, default: 0 },
    pool4Match: { type: Number, default: 0 },
    pool3Match: { type: Number, default: 0 },
    jackpotRolledOver: { type: Number, default: 0 }, // carried from prev month
    
    winners: [winnerEntrySchema],
    activeSubscribersCount: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

drawSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Draw', drawSchema);
