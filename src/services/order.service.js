import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { Order } from '../models/order.model.js';
import { ApiError } from '../utils/ApiError.js';

export const checkoutOrderService = async (userId, shippingAddress) => {
    // Fetch user cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your shopping cart is empty");
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validate stock availability and snapshot financial calculation values
    for (const item of cart.items) {
        const product = item.product;
        if (!product) {
            throw new ApiError(404, "One of the products in your cart no longer exists");
        }

        if (product.stock < item.quantity) {
            throw new ApiError(
                400, `Insufficient stock for ${product.name}. Only ${product.stock} left.`
            );
        }

        totalAmount += product.price * item.quantity;

        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            priceAtPurchase: product.price,
        });
    }

    // 3. Deduct inventory quantities concurrently
    const stockDeductionPromises = cart.items.map((item) =>
        Product.findByIdAndUpdate(
            item.product._id,
            { $inc: { stock: -item.quantity } }, // Subtracts exact quantity from available MongoDB numbers safely
            { returnDocument: 'after' }
        )
    );
    await Promise.all(stockDeductionPromises);

    // Create the final absolute Order Document
    const order = await Order.create({
        user: userId,
        items: orderItems,
        totalAmount,
        shippingAddress,
    });

    // Hard purge the user's shopping cart clean
    cart.items = [];
    await cart.save();

    return order;
}