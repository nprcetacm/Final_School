const express = require('express');
const router = express.Router();
const { login, seedAdmin } = require('../controllers/authController');
const { check, validationResult } = require('express-validator');

const validateLogin = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];

const checkErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post('/login', validateLogin, checkErrors, login);
router.post('/seed', seedAdmin);

module.exports = router;
