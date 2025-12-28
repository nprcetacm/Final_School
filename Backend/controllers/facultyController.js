const pool = require('../config/db');

// --- Teaching Faculty ---

exports.getAllTeachers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM faculty_teachers');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addTeacher = async (req, res) => {
    const { name, gender, qual, role, subjects, class: className, exp } = req.body;
    try {
        // Ensure subjects is saved as a JSON array
        let subjectsArray = [];
        if (Array.isArray(subjects)) {
            subjectsArray = subjects;
        } else if (typeof subjects === 'string') {
            subjectsArray = subjects.split(',').map(s => s.trim()).filter(s => s !== '');
        }
        const subjectsJson = JSON.stringify(subjectsArray);

        await pool.query(
            'INSERT INTO faculty_teachers (name, gender, qual, role, subjects, class, exp) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, gender, qual, role, subjectsJson, className, exp]
        );
        res.status(201).json({ msg: 'Teacher added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTeacher = async (req, res) => {
    const { id } = req.params;
    const { name, gender, qual, role, subjects, class: className, exp } = req.body;
    try {
        // Ensure subjects is saved as a JSON array
        let subjectsArray = [];
        if (Array.isArray(subjects)) {
            subjectsArray = subjects;
        } else if (typeof subjects === 'string') {
            subjectsArray = subjects.split(',').map(s => s.trim()).filter(s => s !== '');
        }
        const subjectsJson = JSON.stringify(subjectsArray);

        await pool.query(
            'UPDATE faculty_teachers SET name=?, gender=?, qual=?, role=?, subjects=?, class=?, exp=? WHERE id=?',
            [name, gender, qual, role, subjectsJson, className, exp, id]
        );
        res.json({ msg: 'Teacher updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTeacher = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM faculty_teachers WHERE id = ?', [id]);
        res.json({ msg: 'Teacher deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- Non-Teaching Faculty ---

exports.getAllNonTeaching = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM faculty_non_teaching');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addNonTeaching = async (req, res) => {
    const { name, gender, role, qual, exp } = req.body;
    try {
        await pool.query(
            'INSERT INTO faculty_non_teaching (name, gender, role, qual, exp) VALUES (?, ?, ?, ?, ?)',
            [name, gender, role, qual, exp]
        );
        res.status(201).json({ msg: 'Staff added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateNonTeaching = async (req, res) => {
    const { id } = req.params;
    const { name, gender, role, qual, exp } = req.body;
    try {
        await pool.query(
            'UPDATE faculty_non_teaching SET name=?, gender=?, role=?, qual=?, exp=? WHERE id=?',
            [name, gender, role, qual, exp, id]
        );
        res.json({ msg: 'Staff updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteNonTeaching = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM faculty_non_teaching WHERE id = ?', [id]);
        res.json({ msg: 'Staff deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
