import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { checkoutOrderService } from '../services/order.service.js';

export const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress } = req.body;

    const order = await checkoutOrderService(req.user._id, shippingAddress);

    return res
        .status(201)
        .json(new ApiResponse(
            201, order, "Order placed successfully. Your cart has been processed."
        ));
});