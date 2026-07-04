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

export const getAllProductsService = async () => {
    return await Product.find({})
        .populate('category', 'name slug') // Internal join to pull the category name and slug
        .sort({ createdAt: -1 });
}

// Fetch a single product by its unique URL slug
export const getProductBySlugService = async (slug) => {
    const product = await Product.findOne({ slug }).populate('category', 'name slug');
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return product;
}