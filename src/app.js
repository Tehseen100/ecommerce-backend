import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

// Global Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
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


export default app;