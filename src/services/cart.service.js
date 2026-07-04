import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';

export const addItemToCartService = async (userId, productId, quantity) => {
    // Verify the product exists and check stock limits
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.stock < quantity) {
        throw new ApiError(400, `Only ${product.stock} items available in stock`);
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }

    // Check if the product already exists in the cart array
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
        // Product exists, update the quantity 
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (product.stock < newQuantity) {
            throw new ApiError(
                400, `Cannot add more. Only ${product.stock} items available in stock`
            );
        }

        cart.items[itemIndex].quantity = newQuantity;
    } else {
        // Product does not exist, push new item object
        cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    return await cart.populate('items.product', 'name price images slug');
}

export const getUserCartService = async (userId) => {
    let cart = await Cart
        .findOne({ user: userId })
        .populate('items.product', 'name price images slug');
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }

    return cart;
}

export const removeItemFromCartService = async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new ApiError(404, "Cart not found");

    // Filter out the item matching the target product ID
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    await cart.save({ validateBeforeSave: false });

    return await cart.populate('items.product', 'name price images slug');
}