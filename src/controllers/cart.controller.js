import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {
    addItemToCartService,
    getUserCartService,
    removeItemFromCartService
} from '../services/cart.service.js';

export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    // req.user._id comes straight from our auth middleware
    const cart = await addItemToCartService(req.user._id, productId, quantity);

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Item added to cart successfully"));
});

export const getUserCart = asyncHandler(async (req, res) => {
    const cart = await getUserCartService(req.user._id);

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

export const removeItemFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const cart = await removeItemFromCartService(req.user._id, productId);

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Item removed from cart successfully"));
});