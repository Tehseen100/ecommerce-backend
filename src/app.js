import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import authRouter from './routes/auth.routes.js';
import categoryRouter from './routes/category.routes.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';

const app = express();

// Global Middlewares
app.use(cors({
    origin: env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK', message: 'Server is running smoothly'
    });
});

// API Routes Mounting
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/cart', cartRouter);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;