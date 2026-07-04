import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadOnCloudinary = async (localFilePath, folderName = "ecommerce_products") => {
    try {
        if (!localFilePath) return null;

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: folderName,
        });

        // File uploaded successfully, remove it locally
        fs.unlinkSync(localFilePath);
        return {
            url: response.secure_url,
            publicId: response.public_id,
        }
    } catch (error) {
        // If upload fails, remove it locally
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error("Cloudinary upload failed:", error.message);
        return null;
    }
}

export const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error(`Failed to delete asset ${publicId} from Cloudinary:`, error.message);
        return null;
    }
}