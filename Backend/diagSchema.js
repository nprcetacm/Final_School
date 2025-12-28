const pool = require('./config/db');

const checkSchema = async () => {
    try {
        console.log('--- Checking gallery_items table ---');
        const [itemsTable] = await pool.query('SHOW CREATE TABLE gallery_items');
        console.log(itemsTable[0]['Create Table']);

        console.log('\n--- Checking gallery_images table ---');
        const [imagesTable] = await pool.query('SHOW CREATE TABLE gallery_images');
        console.log(imagesTable[0]['Create Table']);

        console.log('\n--- Checking for orphaned gallery_images ---');
        const [orphans] = await pool.query('SELECT * FROM gallery_images WHERE gallery_item_id NOT IN (SELECT id FROM gallery_items)');
        console.log(`Found ${orphans.length} orphaned images.`);

        process.exit(0);
    } catch (err) {
        console.error('Diagnostic error:', err);
        process.exit(1);
    }
};

checkSchema();
