const Score = require('../models/Score.model');

exports.getMyScores = async (req, res) => {
  try {
    let score = await Score.findOne({ user: req.user._id });
    if (!score) score = { entries: [] };
    res.json({ success: true, scores: score.entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addScore = async (req, res) => {
  try {
    const { value, date } = req.body;
    if (!value || !date) return res.status(400).json({ success: false, message: 'Value and date required' });
    if (value < 1 || value > 45) return res.status(400).json({ success: false, message: 'Score must be between 1 and 45' });

    let scoreDoc = await Score.findOne({ user: req.user._id });
    if (!scoreDoc) scoreDoc = new Score({ user: req.user._id, entries: [] });

    scoreDoc.addScore(Number(value), date);
    await scoreDoc.save();
    res.json({ success: true, scores: scoreDoc.entries, message: 'Score added successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.editScore = async (req, res) => {
  try {
    const { entryId } = req.params;
    const { value } = req.body;
    if (!value || value < 1 || value > 45)
      return res.status(400).json({ success: false, message: 'Score must be between 1 and 45' });

    const scoreDoc = await Score.findOne({ user: req.user._id });
    if (!scoreDoc) return res.status(404).json({ success: false, message: 'No scores found' });

    const entry = scoreDoc.entries.id(entryId);
    if (!entry) return res.status(404).json({ success: false, message: 'Score entry not found' });

    entry.value = Number(value);
    await scoreDoc.save();
    res.json({ success: true, scores: scoreDoc.entries, message: 'Score updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteScore = async (req, res) => {
  try {
    const { entryId } = req.params;
    const scoreDoc = await Score.findOne({ user: req.user._id });
    if (!scoreDoc) return res.status(404).json({ success: false, message: 'No scores found' });

    scoreDoc.entries = scoreDoc.entries.filter((e) => e._id.toString() !== entryId);
    await scoreDoc.save();
    res.json({ success: true, scores: scoreDoc.entries, message: 'Score deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};