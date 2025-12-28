const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const achievementsController = require('../controllers/achievementsController');

router.get('/', achievementsController.getAllAchievements);
router.post('/', [auth, upload.array('images', 5)], achievementsController.addAchievement);
router.put('/:id', auth, upload.array('images', 5), achievementsController.updateAchievement);
router.delete('/:id', auth, achievementsController.deleteAchievement);

module.exports = router;
