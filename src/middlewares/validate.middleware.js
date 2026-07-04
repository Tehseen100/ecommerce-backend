import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
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
};