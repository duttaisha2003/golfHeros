const Draw = require('../models/Draw.model');

exports.getMyWinnings = async (req, res) => {
  try {
    const draws = await Draw.find({ 'winners.user': req.user._id, status: 'published' }).sort({ year: -1, month: -1 });
    const winnings = draws.flatMap((d) =>
      d.winners
        .filter((w) => w.user.toString() === req.user._id.toString())
        .map((w) => ({ ...w.toObject(), month: d.month, year: d.year, drawId: d._id }))
    );
    res.json({ success: true, winnings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadProof = async (req, res) => {
  try {
    const { drawId, winnerId } = req.params;
    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' });

    const winner = draw.winners.id(winnerId);
    if (!winner) return res.status(404).json({ success: false, message: 'Winner entry not found' });
    if (winner.user.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorised' });

    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    winner.proofImage = '/uploads/' + req.file.filename;
    winner.verificationStatus = 'pending';
    await draw.save();
    res.json({ success: true, message: 'Proof uploaded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: all winners
exports.getAllWinners = async (req, res) => {
  try {
    const draws = await Draw.find({ status: 'published', 'winners.0': { $exists: true } })
      .populate('winners.user', 'name email')
      .sort({ year: -1, month: -1 });

    const allWinners = draws.flatMap((d) =>
      d.winners.map((w) => ({ ...w.toObject(), month: d.month, year: d.year, drawId: d._id }))
    );
    res.json({ success: true, winners: allWinners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: verify winner
exports.verifyWinner = async (req, res) => {
  try {
    const { drawId, winnerId } = req.params;
    const { status } = req.body; // approved | rejected
    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' });

    const winner = draw.winners.id(winnerId);
    if (!winner) return res.status(404).json({ success: false, message: 'Winner not found' });

    winner.verificationStatus = status;
    await draw.save();
    res.json({ success: true, message: 'Verification updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: mark payout
exports.markPaid = async (req, res) => {
  try {
    const { drawId, winnerId } = req.params;
    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' });

    const winner = draw.winners.id(winnerId);
    if (!winner) return res.status(404).json({ success: false, message: 'Winner not found' });

    winner.paymentStatus = 'paid';
    winner.paidAt = new Date();
    await draw.save();
    res.json({ success: true, message: 'Marked as paid' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};