const router = require('express').Router();
const { getAllDraws, getCurrentDraw, createDraw, simulateDraw, publishDraw, getAdminDraws } = require('../controllers/draw.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', getAllDraws);
router.get('/current', getCurrentDraw);

// Admin
router.get('/admin/all', protect, adminOnly, getAdminDraws);
router.post('/', protect, adminOnly, createDraw);
router.post('/:id/simulate', protect, adminOnly, simulateDraw);
router.post('/:id/publish', protect, adminOnly, publishDraw);

module.exports = router;