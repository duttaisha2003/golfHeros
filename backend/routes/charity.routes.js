const router = require('express').Router();
const { getAllCharities, getFeaturedCharity, getCharityById, selectCharity, createCharity, updateCharity, deleteCharity } = require('../controllers/charity.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', getAllCharities);
router.get('/featured', getFeaturedCharity);
router.get('/:id', getCharityById);

// Authenticated
router.put('/select', protect, selectCharity);

// Admin
router.post('/', protect, adminOnly, createCharity);
router.put('/:id', protect, adminOnly, updateCharity);
router.delete('/:id', protect, adminOnly, deleteCharity);

module.exports = router;