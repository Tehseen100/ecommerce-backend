import { z } from 'zod';

export const categorySchema = z.object({
    name: z
        .string({ required_error: "Category name is required" })
        .trim()
        .min(2, "Category name must be at least 2 characters long")
        .max(32, "Category name cannot exceed 32 characters"),
});