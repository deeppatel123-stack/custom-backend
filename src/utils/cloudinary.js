import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const API_KEY = process.env.CLOUDINARY_API_KEY?.trim();
const API_SECRET = process.env.CLOUDINARY_API_SECRET?.trim();

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('Cloudinary environment variables are missing or empty.');
  console.error('Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are set.');
  
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const uploadoncloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    // optional: check file exists (useful for local path debugging)
    if (!fs.existsSync(filePath)) {
      throw new Error(`Local file not found: ${filePath}`);
    }

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
    });

    // cloudinary's response often contains secure_url
    // console.log('Cloudinary upload response (secure_url):', response.secure_url || response.url);
    fs.unlinkSync(filePath); // delete local file after upload
    return response;
  } catch (error) {
    // Provide clearer error message for common cause
    if (error.message && error.message.includes('Invalid cloud_name')) {
      console.error('Cloudinary rejected the cloud_name. Check CLOUDINARY_CLOUD_NAME value in your env.');
    }
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export { uploadoncloudinary };
