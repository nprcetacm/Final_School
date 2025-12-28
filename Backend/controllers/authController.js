const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            id: user.id,
            role: user.role
        };

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is missing in .env');
            return res.status(500).json({ msg: 'Server configuration error' });
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
        res.json({ token, role: user.role });

    } catch (err) {
        console.error('Core Login Error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

exports.seedAdmin = async (req, res) => {
    const { email, password } = req.body; // or hardcoded for demo

    try {
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, 'admin']);

        res.json({ msg: 'Admin created successfully' });

    } catch (err) {
        console.error('Seed Error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};
