import { z } from 'zod';

export const addToCartSchema = z.object({
    productId: z
        .string({ required_error: "Product ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID format"),
    quantity: z
        .number()
        .int()
        .min(1, "Quantity must be at least 1")
        .default(1),
});