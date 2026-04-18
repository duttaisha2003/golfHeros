const mongoose = require('mongoose');

const scoreEntrySchema = new mongoose.Schema({
  value: { type: Number, required: true, min: 1, max: 45 },
  date: { type: Date, required: true },
}, { _id: true });

const scoreSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    entries: {
      type: [scoreEntrySchema],
      validate: {
        validator: function (v) { return v.length <= 5; },
        message: 'Maximum 5 scores allowed.',
      },
    },
  },
  { timestamps: true }
);

// Add score — keeps only last 5, prevents duplicate dates
scoreSchema.methods.addScore = function (value, date) {
  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);

  // Check for duplicate date
  const duplicate = this.entries.find((e) => {
    const d = new Date(e.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === inputDate.getTime();
  });
  if (duplicate) throw new Error('A score for this date already exists. Edit or delete it instead.');

  this.entries.push({ value, date: inputDate });
  // Sort by date desc, keep latest 5
  this.entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (this.entries.length > 5) this.entries = this.entries.slice(0, 5);
};

module.exports = mongoose.model('Score', scoreSchema);
