const pool = require('../config/db');

exports.getAllToppers = async (req, res) => {
    try {
        const [toppers] = await pool.query('SELECT * FROM topper_students ORDER BY score DESC');
        res.json(toppers);
    } catch (err) {
        console.error('Error fetching toppers:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.addTopper = async (req, res) => {
    const { std, name, group, score, outOf, rank } = req.body;
    try {
        if (!req.file) {
            console.error('Multer failed to populate req.file for topper.');
            return res.status(400).json({ msg: 'Student image is required. Please check Cloudinary credentials.' });
        }
        const image = req.file.path;

        await pool.query(
            'INSERT INTO topper_students (std, name, image, `group`, score, outOf, `rank`) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [std, name, image, group, score, outOf, rank]
        );
        res.status(201).json({ msg: 'Topper added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTopper = async (req, res) => {
    const { id } = req.params;
    const { std, name, group, score, outOf, rank } = req.body;
    try {
        let updateQuery = 'UPDATE topper_students SET std = ?, name = ?, `group` = ?, score = ?, outOf = ?, `rank` = ? WHERE id = ?';
        let queryParams = [std, name, group, score, outOf, rank, id];

        if (req.file) {
            const image = req.file.path;
            updateQuery = 'UPDATE topper_students SET std = ?, name = ?, `group` = ?, score = ?, outOf = ?, `rank` = ?, image = ? WHERE id = ?';
            queryParams = [std, name, group, score, outOf, rank, image, id];
        }

        await pool.query(updateQuery, queryParams);
        res.json({ msg: 'Topper updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTopper = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM topper_students WHERE id = ?', [id]);
        res.json({ msg: 'Topper deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
