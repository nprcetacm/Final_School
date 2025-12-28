const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const facultyController = require('../controllers/facultyController');

// Teachers
router.get('/teachers', facultyController.getAllTeachers);
router.post('/teachers', auth, facultyController.addTeacher);
router.put('/teachers/:id', auth, facultyController.updateTeacher);
router.delete('/teachers/:id', auth, facultyController.deleteTeacher);

// Non-Teaching
router.get('/non-teaching', facultyController.getAllNonTeaching);
router.post('/non-teaching', auth, facultyController.addNonTeaching);
router.put('/non-teaching/:id', auth, facultyController.updateNonTeaching);
router.delete('/non-teaching/:id', auth, facultyController.deleteNonTeaching);

module.exports = router;
