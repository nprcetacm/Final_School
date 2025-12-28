const pool = require('../config/db');

exports.getAllAchievements = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM achievements ORDER BY date DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addAchievement = async (req, res) => {
    const { title, date, year, description, category } = req.body;
    try {
        if (!req.files) {
            console.error('Multer failed to populate req.files for achievements.');
            return res.status(500).json({ msg: 'Image upload failed. Please verify Cloudinary credentials.' });
        }
        const files = req.files;
        const imageUrls = files.map(file => file.path); // Cloudinary URLs

        await pool.query(
            'INSERT INTO achievements (title, date, year, description, images, category) VALUES (?, ?, ?, ?, ?, ?)',
            [title, date, year, description, JSON.stringify(imageUrls), category]
        );
        res.status(201).json({ msg: 'Achievement added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAchievement = async (req, res) => {
    const { id } = req.params;
    const { title, date, year, description, category } = req.body;
    let imageUrls = [];

    try {
        // Check if new files are uploaded
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => file.path);
        } else if (req.body.images) {
            // If no new files, but images array is passed in body (e.g., existing images kept)
            imageUrls = JSON.parse(req.body.images);
        }

        let query = 'UPDATE achievements SET title = ?, date = ?, year = ?, description = ?, category = ?';
        let params = [title, date, year, description, category];

        if (imageUrls.length > 0) {
            query += ', images = ?';
            params.push(JSON.stringify(imageUrls));
        }

        query += ' WHERE id = ?';
        params.push(id);

        await pool.query(query, params);
        res.json({ msg: 'Achievement updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAchievement = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM achievements WHERE id = ?', [id]);
        res.json({ msg: 'Achievement deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
