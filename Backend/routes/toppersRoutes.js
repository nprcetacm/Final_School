const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const toppersController = require('../controllers/toppersController');

router.get('/', toppersController.getAllToppers);
router.post('/', [auth, upload.single('image')], toppersController.addTopper);
router.put('/:id', auth, upload.single('image'), toppersController.updateTopper);
router.delete('/:id', auth, toppersController.deleteTopper);

module.exports = router;
