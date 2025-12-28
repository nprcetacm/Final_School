const cloudinary = require('cloudinary').v2;
require('dotenv').config();

async function check(name) {
    console.log(`--- Testing: ${name} ---`);
    cloudinary.config({
        cloud_name: name,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        const res = await cloudinary.uploader.upload('https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png');
        console.log(`Result: SUCCESS! URL: ${res.secure_url}`);
        return true;
    } catch (err) {
        console.log(`Result: FAILED - ${err.message}`);
        return false;
    }
}

async function run() {
    await check('School');
    await check('school');
    await check('Root');
    await check('root');
    process.exit();
}

run();
