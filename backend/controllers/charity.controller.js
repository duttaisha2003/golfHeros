const Charity = require('../models/Charity.model');
const User = require('../models/User.model');

exports.getAllCharities = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = { isActive: true };
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    const charities = await Charity.find(filter).sort({ isFeatured: -1, name: 1 });
    res.json({ success: true, charities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFeaturedCharity = async (req, res) => {
  try {
    const charity = await Charity.findOne({ isFeatured: true, isActive: true });
    res.json({ success: true, charity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCharityById = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) return res.status(404).json({ success: false, message: 'Charity not found' });
    res.json({ success: true, charity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.selectCharity = async (req, res) => {
  try {
    const { charityId, percentage } = req.body;
    const pct = Number(percentage) || 10;
    if (pct < 10 || pct > 100) return res.status(400).json({ success: false, message: 'Percentage must be between 10 and 100' });

    const charity = await Charity.findById(charityId);
    if (!charity) return res.status(404).json({ success: false, message: 'Charity not found' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { selectedCharity: charityId, charityPercentage: pct },
      { new: true }
    ).populate('selectedCharity', 'name logo');
    res.json({ success: true, user, message: 'Charity updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin CRUD
exports.createCharity = async (req, res) => {
  try {
    const charity = await Charity.create(req.body);
    res.status(201).json({ success: true, charity });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!charity) return res.status(404).json({ success: false, message: 'Charity not found' });
    res.json({ success: true, charity });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteCharity = async (req, res) => {
  try {
    await Charity.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Charity removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};