import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string({ required_error: "Product name is required" }).trim().min(3).max(120),
    description: z.string({ required_error: "Description is required" }).trim().max(2000),

    price: z.preprocess(
        (val) => Number(val),
        z.number({ required_error: "Price is required" }).min(0, "Price cannot be negative")
    ),

    stock: z.preprocess(
        (val) => Number(val),
        z.number({ required_error: "Stock is required" }).min(0, "Stock cannot be negative")
    ),

    category: z.string({ required_error: "Category ID is required" }).regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format"),
});