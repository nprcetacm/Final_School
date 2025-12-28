const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const noticesController = require('../controllers/noticesController');

router.get('/', noticesController.getAllNotices);
router.post('/', auth, noticesController.addNotice);
router.put('/:id', auth, noticesController.updateNotice);
router.delete('/:id', auth, noticesController.deleteNotice);

module.exports = router;
