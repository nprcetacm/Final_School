const pool = require('./config/db');
const bcrypt = require('bcrypt');

const initDb = async () => {
    try {
        // Create Database if not exists (need root connection for this usually, but assuming DB might exist)
        // Creating tables
        const queries = [
            `CREATE TABLE IF NOT EXISTS achievements (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                year YEAR NOT NULL,
                description TEXT NOT NULL,
                images JSON NOT NULL,
                category VARCHAR(100) NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS faculty_teachers (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(150) NOT NULL,
                gender VARCHAR(10) NOT NULL,
                qual VARCHAR(150) NOT NULL,
                role VARCHAR(50) NOT NULL,
                subjects JSON NOT NULL,                 
                class VARCHAR(50) NOT NULL,
                exp DATE NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS faculty_non_teaching (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(150) NOT NULL,
                gender VARCHAR(10) NOT NULL,
                role VARCHAR(100) NOT NULL,
                qual VARCHAR(150) NOT NULL,
                exp DATE NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS notices (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                titleEng VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                category VARCHAR(100) NOT NULL,
                priority VARCHAR(20) NOT NULL,
                description TEXT NOT NULL,
                descriptionEng TEXT NOT NULL,
                author VARCHAR(150) NOT NULL,
                isPinned BOOLEAN DEFAULT FALSE
            )`,
            `CREATE TABLE IF NOT EXISTS topper_students (
                id INT PRIMARY KEY AUTO_INCREMENT,
                std VARCHAR(10) NOT NULL,        
                name VARCHAR(100) NOT NULL,
                image VARCHAR(500) NOT NULL,
                \`group\` VARCHAR(200) NOT NULL,
                score INT NOT NULL,
                outOf INT NOT NULL,
                \`rank\` INT NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS gallery_items (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                date DATE NOT NULL,
                shortDescription TEXT NOT NULL,
                thumbnail VARCHAR(500) NOT NULL,
                fullDescription TEXT NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS gallery_images (
                id INT PRIMARY KEY AUTO_INCREMENT,
                gallery_item_id INT NOT NULL,
                image VARCHAR(500) NOT NULL,
                FOREIGN KEY (gallery_item_id) REFERENCES gallery_items(id) ON DELETE CASCADE
            )`
        ];

        for (const query of queries) {
            await pool.query(query);
        }

        console.log('Database tables initialized successfully');

        // Check if specific admin user exists
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [adminEmail]);

        if (users.length === 0) {
            const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            await pool.query(
                'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
                [adminEmail, hashedPassword, 'admin']
            );
            console.log(`Default admin user created: ${adminEmail}`);
        } else {
            console.log(`Admin user ${adminEmail} already exists, skipping seeding`);
        }

        process.exit(0);

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

initDb();
