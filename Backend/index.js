const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const noticesRoutes = require('./routes/noticesRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const achievementsRoutes = require('./routes/achievementsRoutes');
const toppersRoutes = require('./routes/toppersRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/notices', noticesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/toppers', toppersRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('--- GLOBAL ERROR HANDLER ---');
    console.error(err.stack);
    console.error('---------------------------');
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
