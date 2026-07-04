import { Category } from '../models/category.model.js';
import { ApiError } from '../utils/ApiError.js';

// Create a new category
export const createCategoryService = async (name) => {
    const existedCategory = await Category.findOne({ name });
    if (existedCategory) {
        throw new ApiError(409, "Category already exists");
    }

    const category = await Category.create({ name });
    return category;
}

// Fetch all available categories
export const getAllCategoriesService = async () => {
    return await Category.find({}).sort({ name: 1 }); // Sort alphabetically
}