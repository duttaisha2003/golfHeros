const User = require('../models/User.model');
const Score = require('../models/Score.model');
const Draw = require('../models/Draw.model');
const Charity = require('../models/Charity.model');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, activeSubscribers, totalCharities, latestDraw] = await Promise.all([
      User.countDocuments({ role: 'subscriber' }),
      User.countDocuments({ 'subscription.status': 'active', role: 'subscriber' }),
      Charity.countDocuments({ isActive: true }),
      Draw.findOne({ status: 'published' }).sort({ year: -1, month: -1 }),
    ]);

    // Charity contribution totals
    const charityData = await User.aggregate([
      { $match: { 'subscription.status': 'active', role: 'subscriber' } },
      { $group: { _id: '$selectedCharity', totalUsers: { $sum: 1 }, avgPct: { $avg: '$charityPercentage' } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeSubscribers,
        totalCharities,
        latestDraw: latestDraw ? { month: latestDraw.month, year: latestDraw.year, totalPool: latestDraw.totalPool, winnersCount: latestDraw.winners.length } : null,
        charityData,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const filter = { role: 'subscriber' };
    if (status) filter['subscription.status'] = status;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const users = await User.find(filter)
      .populate('selectedCharity', 'name')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({ success: true, users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('selectedCharity', 'name logo').select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const scores = await Score.findOne({ user: req.params.id });
    res.json({ success: true, user, scores: scores ? scores.entries : [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, isActive, subscription } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, isActive, subscription },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const { status, plan, endDate } = req.body;
    const update = { 'subscription.status': status };
    if (plan) update['subscription.plan'] = plan;
    if (endDate) { update['subscription.endDate'] = new Date(endDate); update['subscription.renewalDate'] = new Date(endDate); }

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user, message: 'Subscription updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.editUserScore = async (req, res) => {
  try {
    const { entryId, value } = req.body;
    if (value < 1 || value > 45) return res.status(400).json({ success: false, message: 'Score must be 1-45' });
    const scoreDoc = await Score.findOne({ user: req.params.id });
    if (!scoreDoc) return res.status(404).json({ success: false, message: 'No scores found for this user' });
    const entry = scoreDoc.entries.id(entryId);
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    entry.value = Number(value);
    await scoreDoc.save();
    res.json({ success: true, scores: scoreDoc.entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};