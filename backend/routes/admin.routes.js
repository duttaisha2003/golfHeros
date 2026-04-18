const router = require('express').Router();
const { getDashboardStats, getAllUsers, getUserById, updateUser, updateSubscription, editUserScore } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.put('/users/:id/subscription', updateSubscription);
router.put('/users/:id/scores', editUserScore);

module.exports = router;