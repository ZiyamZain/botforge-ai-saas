import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: "dkcvgfuwe",
  api_key: "675344122166646",
  api_secret: "7Sf8xJzH7swNt6kp1llLMj-0nGU",
});

async function testUpload() {
  try {
    const filePath = path.join(__dirname, '../../sample_return_policy.pdf');
    const result = await cloudinary.uploader.upload(filePath, { resource_type: 'raw' });
    console.log("Upload successful:", result.secure_url);
  } catch (error) {
    console.error("Cloudinary Error:", error);
  }
}

testUpload();
