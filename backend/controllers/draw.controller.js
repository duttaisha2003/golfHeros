const Draw = require('../models/Draw.model');
const Score = require('../models/Score.model');
const User = require('../models/User.model');

// Helper: generate 5 unique random numbers from user score pool (1-45)
const randomDraw = () => {
  const nums = new Set();
  while (nums.size < 5) nums.add(Math.floor(Math.random() * 45) + 1);
  return Array.from(nums);
};

// Helper: algorithmic draw based on most frequent scores across all users
const algorithmicDraw = async () => {
  const allScores = await Score.find({});
  const freq = {};
  allScores.forEach((s) => s.entries.forEach((e) => { freq[e.value] = (freq[e.value] || 0) + 1; }));
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 5).map(([v]) => Number(v));
  while (top.length < 5) {
    const r = Math.floor(Math.random() * 45) + 1;
    if (!top.includes(r)) top.push(r);
  }
  return top.slice(0, 5);
};

// Helper: calculate prizes
const MONTHLY_SUBSCRIPTION_PRICE = 10; // placeholder
const PRIZE_SHARE = 0.5; // 50% of subscription to prize pool

const calculatePools = (subscriberCount, jackpotRollover = 0) => {
  const total = subscriberCount * MONTHLY_SUBSCRIPTION_PRICE * PRIZE_SHARE + jackpotRollover;
  return {
    totalPool: parseFloat(total.toFixed(2)),
    pool5Match: parseFloat((total * 0.4).toFixed(2)),
    pool4Match: parseFloat((total * 0.35).toFixed(2)),
    pool3Match: parseFloat((total * 0.25).toFixed(2)),
  };
};

// Match user scores against drawn numbers
const matchScores = (userEntries, drawnNumbers) => {
  const userVals = userEntries.map((e) => e.value);
  return drawnNumbers.filter((n) => userVals.includes(n)).length;
};

exports.getAllDraws = async (req, res) => {
  try {
    const draws = await Draw.find({ status: 'published' }).sort({ year: -1, month: -1 }).limit(12);
    res.json({ success: true, draws });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCurrentDraw = async (req, res) => {
  try {
    const now = new Date();
    const draw = await Draw.findOne({ month: now.getMonth() + 1, year: now.getFullYear() });
    res.json({ success: true, draw });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: create / configure draw
exports.createDraw = async (req, res) => {
  try {
    const { month, year, drawType } = req.body;
    const existing = await Draw.findOne({ month, year });
    if (existing) return res.status(400).json({ success: false, message: 'Draw for this month already exists' });

    const activeUsers = await User.countDocuments({ 'subscription.status': 'active', role: 'subscriber' });

    // Check previous jackpot rollover
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevDraw = await Draw.findOne({ month: prevMonth, year: prevYear, status: 'published' });
    const jackpotRollover = prevDraw && !prevDraw.winners.some((w) => w.matchType === '5-match') ? prevDraw.pool5Match : 0;

    const pools = calculatePools(activeUsers, jackpotRollover);
    const draw = await Draw.create({ month, year, drawType: drawType || 'random', activeSubscribersCount: activeUsers, jackpotRolledOver: jackpotRollover, ...pools });
    res.status(201).json({ success: true, draw });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin: simulate draw (generate numbers, find winners — draft mode)
exports.simulateDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' });

    const drawnNumbers = draw.drawType === 'algorithmic' ? await algorithmicDraw() : randomDraw();
    const allScores = await Score.find({}).populate('user', 'name email');

    const winners5 = [], winners4 = [], winners3 = [];
    allScores.forEach((s) => {
      const matches = matchScores(s.entries, drawnNumbers);
      const userObj = { user: s.user._id, matchedNumbers: drawnNumbers.filter((n) => s.entries.map((e) => e.value).includes(n)) };
      if (matches >= 5) winners5.push({ ...userObj, matchType: '5-match' });
      else if (matches === 4) winners4.push({ ...userObj, matchType: '4-match' });
      else if (matches === 3) winners3.push({ ...userObj, matchType: '3-match' });
    });

    // Calculate prize per winner
    const calcPrize = (pool, count) => count > 0 ? parseFloat((pool / count).toFixed(2)) : 0;
    const prize5 = calcPrize(draw.pool5Match, winners5.length);
    const prize4 = calcPrize(draw.pool4Match, winners4.length);
    const prize3 = calcPrize(draw.pool3Match, winners3.length);

    const allWinners = [
      ...winners5.map((w) => ({ ...w, prizeAmount: prize5 })),
      ...winners4.map((w) => ({ ...w, prizeAmount: prize4 })),
      ...winners3.map((w) => ({ ...w, prizeAmount: prize3 })),
    ];

    draw.drawnNumbers = drawnNumbers;
    draw.winners = allWinners;
    draw.status = 'simulation';
    await draw.save();

    res.json({ success: true, draw, message: 'Simulation complete' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: publish draw
exports.publishDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' });
    if (draw.drawnNumbers.length === 0) return res.status(400).json({ success: false, message: 'Simulate draw before publishing' });

    draw.status = 'published';
    draw.publishedAt = new Date();
    await draw.save();
    res.json({ success: true, draw, message: 'Draw published successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAdminDraws = async (req, res) => {
  try {
    const draws = await Draw.find().sort({ year: -1, month: -1 });
    res.json({ success: true, draws });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};