import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/isAdmin.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { categorySchema } from '../validators/category.validator.js';
import { createCategory, getAllCategories } from '../controllers/category.controller.js';

const router = Router();


// Public route: Everyone can see categories
router.get('/', getAllCategories);

// Protected route: Only logged-in Admins can create categories
router.post('/', verifyJWT, isAdmin, validate(categorySchema), createCategory);

export default router;