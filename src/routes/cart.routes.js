import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { addToCartSchema } from '../validators/cart.validator.js';
import {
    addToCart,
    getUserCart,
    removeItemFromCart
} from '../controllers/cart.controller.js';

const router = Router();

// Protect every single cart operation below this line
router.use(verifyJWT);

router.get('/', getUserCart);
router.post('/', validate(addToCartSchema), addToCart);
router.delete('/:productId', removeItemFromCart);

export default router;