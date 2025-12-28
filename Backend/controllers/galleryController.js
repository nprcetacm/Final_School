const pool = require('../config/db');

exports.getAllGalleryItems = async (req, res) => {
    try {
        const [items] = await pool.query('SELECT * FROM gallery_items ORDER BY date DESC');

        // Fetch images for each item
        for (let item of items) {
            const [images] = await pool.query('SELECT image FROM gallery_images WHERE gallery_item_id = ?', [item.id]);
            item.images = images.map(img => img.image);
        }

        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createGalleryItem = async (req, res) => {
    const { title, category, date, shortDescription, fullDescription } = req.body;
    // req.files should contain the images (handled by multer)
    // We assume the first image is the thumbnail if not specified, 
    // OR we explicitly ask for 'thumbnail' field in multer and 'images' field.
    // For simplicity, let's assume one field 'images' and the first one is thumbnail
    // OR we modify the upload middleware to handle fields.

    // Let's assume 'thumbnail' is a single file and 'images' is an array of files if needed. 
    // But the schema has 'thumbnail' in gallery_items and separate 'gallery_images'.

    // Simplification: the thumbnail is uploaded via 'thumbnail' field.
    // Gallery images via 'images' field.

    try {
        if (!date || date === '') {
            return res.status(400).json({ msg: 'Date is required' });
        }

        if (!req.files) {
            console.error('Multer failed to populate req.files. Check configuration and credentials.');
            return res.status(500).json({ msg: 'Image upload service error. Please check Cloudinary credentials.' });
        }

        const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;
        const galleryFiles = req.files['images'] || [];

        if (!thumbnailFile) {
            return res.status(400).json({ msg: 'Thumbnail image is required' });
        }

        const thumbnailUrl = thumbnailFile.path;

        const [result] = await pool.query(
            'INSERT INTO gallery_items (title, category, date, shortDescription, thumbnail, fullDescription) VALUES (?, ?, ?, ?, ?, ?)',
            [title, category, date, shortDescription, thumbnailUrl, fullDescription]
        );

        const itemId = result.insertId;

        if (galleryFiles.length > 0) {
            const imageValues = galleryFiles.map(file => [itemId, file.path]);
            await pool.query('INSERT INTO gallery_images (gallery_item_id, image) VALUES ?', [imageValues]);
        }

        res.status(201).json({ msg: 'Gallery item created successfully', id: itemId });

    } catch (err) {
        console.error('Gallery Create Error:', err);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
};

exports.deleteGalleryItem = async (req, res) => {
    const { id } = req.params;
    try {
        // Cascade delete handles images, but we should ideally delete from Cloudinary too.
        // Skipping Cloudinary delete for now to keep it simple, but noted.
        await pool.query('DELETE FROM gallery_items WHERE id = ?', [id]);
        res.json({ msg: 'Gallery item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateGalleryItem = async (req, res) => {
    const { id } = req.params;
    const { title, category, date, shortDescription, fullDescription } = req.body;

    try {
        if (!date || date === '') {
            return res.status(400).json({ msg: 'Date is required' });
        }

        // Update basic fields
        await pool.query(
            'UPDATE gallery_items SET title = ?, category = ?, date = ?, shortDescription = ?, fullDescription = ? WHERE id = ?',
            [title, category, date, shortDescription, fullDescription, id]
        );

        // Handle Thumbnail Update
        if (req.files && req.files['thumbnail']) {
            const thumbnailPath = req.files['thumbnail'][0].path;
            await pool.query('UPDATE gallery_items SET thumbnail = ? WHERE id = ?', [thumbnailPath, id]);
        }

        // Handle New Images
        if (req.files && req.files['images'] && req.files['images'].length > 0) {
            const galleryFiles = req.files['images'];
            const imageValues = galleryFiles.map(file => [id, file.path]);
            await pool.query('INSERT INTO gallery_images (gallery_item_id, image) VALUES ?', [imageValues]);
        }

        res.json({ msg: 'Gallery item updated successfully' });
    } catch (err) {
        console.error('Gallery Update Error:', err);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
};
