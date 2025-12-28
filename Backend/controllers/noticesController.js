const pool = require('../config/db');

exports.getAllNotices = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM notices ORDER BY isPinned DESC, date DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addNotice = async (req, res) => {
    const { title, titleEng, date, category, priority, description, descriptionEng, author, isPinned } = req.body;
    try {
        await pool.query(
            'INSERT INTO notices (title, titleEng, date, category, priority, description, descriptionEng, author, isPinned) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, titleEng, date, category, priority, description, descriptionEng, author, isPinned || false]
        );
        res.status(201).json({ msg: 'Notice added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateNotice = async (req, res) => {
    const { id } = req.params;
    const { title, titleEng, date, category, priority, description, descriptionEng, author, isPinned } = req.body;
    try {
        await pool.query(
            'UPDATE notices SET title=?, titleEng=?, date=?, category=?, priority=?, description=?, descriptionEng=?, author=?, isPinned=? WHERE id=?',
            [title, titleEng, date, category, priority, description, descriptionEng, author, isPinned, id]
        );
        res.json({ msg: 'Notice updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteNotice = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM notices WHERE id = ?', [id]);
        res.json({ msg: 'Notice deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
