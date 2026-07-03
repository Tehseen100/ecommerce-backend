import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import notFound from "./middlewares/notFound.middleware.js";
import { env } from "./config/env.js";

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

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;