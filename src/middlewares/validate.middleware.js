import { ApiError } from '../utils/ApiError.js';
import fs from 'fs';

export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        try {
            // Handle multi-file uploads (req.files)
            if (req.files && req.files.length > 0) {
                req.files.forEach((file) => {
                    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                });
            }

            // Handle single-file uploads (req.file) 
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        } catch (cleanupError) {
            console.error("Failed to clean up local temporary files during validation failure:", cleanupError.message);
        }

        // Format Zod errors cleanly into an array of readable messages
        const errorMessages = result.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));

        // Pass the errors array to ApiError class!
        return next(new ApiError(400, "Validation Failed", errorMessages));
    }

    // Replace req.body with the safely parsed data
    req.body = result.data;
    next();
}