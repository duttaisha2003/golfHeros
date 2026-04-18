const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const User = require('../models/User.model');

// Get subscription status
router.get('/subscription', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscription');
    res.json({ success: true, subscription: user.subscription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Manually activate subscription (placeholder — real payment integration later)
router.post('/subscribe', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!['monthly', 'yearly'].includes(plan)) return res.status(400).json({ success: false, message: 'Invalid plan' });

    const now = new Date();
    const endDate = new Date(now);
    if (plan === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
    else endDate.setFullYear(endDate.getFullYear() + 1);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { subscription: { status: 'active', plan, startDate: now, endDate, renewalDate: endDate } },
      { new: true }
    );
    res.json({ success: true, user, message: 'Subscription activated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;