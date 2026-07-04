import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/isAdmin.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createProductSchema } from '../validators/product.validator.js';
import { createProduct } from '../controllers/product.controller.js';

const router = Router();

// Route config: Auth check -> Admin check -> Multer uploads -> Input validation -> Controller execution
router.post(
    '/',
    verifyJWT,
    isAdmin,
    upload.array('images', 5), // Intercepts up to 5 files named "images"
    validate(createProductSchema),
    createProduct
);

export default router;