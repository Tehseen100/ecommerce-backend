import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinaryService.js';
import { createProductService } from '../services/product.service.js';

export const createProduct = asyncHandler(async (req, res, next) => {
    // Validate that files were uploaded by Multer
    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "At least one product image is required");
    }

    const imageUploadPromises = req.files.map((file) =>
        uploadOnCloudinary(file.path, "ecommerce_products")
    );

    // Upload all images to Cloudinary concurrently
    const uploadResults = await Promise.all(imageUploadPromises);

    // Filter out any failed uploads
    const validImages = uploadResults.filter((img) => img !== null);
    if (validImages.length === 0) {
        throw new ApiError(500, "Failed to upload images to cloud storage");
    }

    // Database Execution Block with Automated Rollback Guard
    try {
        const product = await createProductService(req.body, validImages);

        return res
            .status(201)
            .json(new ApiResponse(201, product, "Product created successfully"));

    } catch (error) {
        // DATABASE WORK FAILED: Trigger cloud rollback infrastructure
        console.warn("DB Operation failed. Cleaning up uploaded assets from Cloudinary...");

        const deletionPromises = validImages.map((img) => deleteFromCloudinary(img.publicId));
        await Promise.all(deletionPromises);

        next(error);
    }
});