import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {
    createCategoryService,
    getAllCategoriesService
} from '../services/category.service.js';

export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await createCategoryService(name);

    return res
        .status(201)
        .json(new ApiResponse(201, category, "Category created successfully"));
});

export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await getAllCategoriesService();

    return res
        .status(200)
        .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});