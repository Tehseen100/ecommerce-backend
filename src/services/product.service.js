import { Product } from '../models/product.model.js';
import { Category } from '../models/category.model.js';
import { ApiError } from '../utils/ApiError.js';

export const createProductService = async (productData, uploadedImages) => {
    // Confirm the target category actually exists
    const categoryExists = await Category.findById(productData.category);
    if (!categoryExists) {
        throw new ApiError(404, "Target category not found");
    }

    // Build product record mapping with our Cloudinary arrays
    const product = await Product.create({
        ...productData,
        images: uploadedImages, // Array of objects containing { url, publicId }
    });

    return product;
}