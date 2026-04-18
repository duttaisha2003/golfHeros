const router = require('express').Router();
const { getMyWinnings, uploadProof, getAllWinners, verifyWinner, markPaid } = require('../controllers/winner.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadSingle } = require('../middleware/upload.middleware');

router.get('/my', protect, getMyWinnings);
router.post('/:drawId/:winnerId/proof', protect, uploadSingle, uploadProof);

// Admin
router.get('/admin/all', protect, adminOnly, getAllWinners);
router.put('/admin/:drawId/:winnerId/verify', protect, adminOnly, verifyWinner);
router.put('/admin/:drawId/:winnerId/pay', protect, adminOnly, markPaid);

module.exports = router;