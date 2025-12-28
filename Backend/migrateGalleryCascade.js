const pool = require('./config/db');

const migrate = async () => {
    try {
        console.log('--- Applying Gallery Foreign Key Migration ---');

        // 1. Get the constraint name (usually gallery_images_ibfk_1)
        const [rows] = await pool.query('SHOW CREATE TABLE gallery_images');
        const createTableSql = rows[0]['Create Table'];
        const match = createTableSql.match(/CONSTRAINT `(\w+)` FOREIGN KEY/);

        if (!match) {
            console.log('No foreign key found to drop.');
        } else {
            const constraintName = match[1];
            console.log(`Dropping constraint: ${constraintName}`);
            await pool.query(`ALTER TABLE gallery_images DROP FOREIGN KEY ${constraintName}`);
        }

        // 2. Add the constraint back with ON DELETE CASCADE
        console.log('Adding cascading foreign key...');
        await pool.query(`
            ALTER TABLE gallery_images 
            ADD CONSTRAINT fk_gallery_item 
            FOREIGN KEY (gallery_item_id) 
            REFERENCES gallery_items(id) 
            ON DELETE CASCADE
        `);

        console.log('Migration successful!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
