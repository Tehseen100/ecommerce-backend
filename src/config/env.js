import 'dotenv/config'; // Load environment variables from .env file
import { z } from 'zod';

// Define the schema for your environment variables
const envSchema = z.object({
    PORT: z.string().transform((val) => parseInt(val, 10)).default('3000'),
    MONGODB_URI: z.string().url({ message: "Invalid MongoDB connection string" }),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    ACCESS_TOKEN_SECRET: z.string().min(10, { message: "Access token secret must be at least 10 chars long" }),
    ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
    REFRESH_TOKEN_SECRET: z.string().min(10, { message: "Refresh token secret must be at least 10 chars long" }),
    REFRESH_TOKEN_EXPIRY: z.string().default('7d'),
    CLOUDINARY_CLOUD_NAME: z.string({ required_error: "Cloudinary cloud name is required" }),
    CLOUDINARY_API_KEY: z.string({ required_error: "Cloudinary API key is required" }),
    CLOUDINARY_API_SECRET: z.string({ required_error: "Cloudinary API secret is required" }),
});

// Validate process.env against our schema
const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
    console.error("Invalid environment variables:", envParse.error.format());
    process.exit(1);
}

export const env = envParse.data;