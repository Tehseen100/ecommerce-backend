import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createOrderSchema } from '../validators/order.validator.js';
import { createOrder } from '../controllers/order.controller.js';

const router = Router();

router.use(verifyJWT);

router.post('/checkout', validate(createOrderSchema), createOrder);

export default router;