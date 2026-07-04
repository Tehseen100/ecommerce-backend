import { z } from 'zod';

export const createOrderSchema = z.object({
    shippingAddress: z.object({
        street: z.string({ required_error: "Street is required" }).trim().min(3),
        city: z.string({ required_error: "City is required" }).trim().min(2),
        postalCode: z.string({ required_error: "Postal code is required" }).trim().min(3),
        country: z.string({ required_error: "Country is required" }).trim().min(2),
    }),
});