const router = require('express').Router();
const { getMyScores, addScore, editScore, deleteScore } = require('../controllers/score.controller');
const { protect, subscriberOnly } = require('../middleware/auth.middleware');

router.use(protect, subscriberOnly);
router.get('/', getMyScores);
router.post('/', addScore);
router.put('/:entryId', editScore);
router.delete('/:entryId', deleteScore);

module.exports = router;