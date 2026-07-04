import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {
    registerUserService,
    loginUserService,
    refreshAccessTokenService,
    logoutUserService
} from '../services/auth.service.js';

// Options for a secure cookie configuration
const cookieOptions = {
    httpOnly: true, // Prevents client-side scripts from reading this cookie
    secure: env.NODE_ENV === 'production', // Cookie only sent over HTTPS in production
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax', // Protects against CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days matches token life
};

export const registerUser = asyncHandler(async (req, res) => {
    // Destructure validated data from req.body
    const { name, email, password } = req.body;

    const user = await registerUserService({ name, email, password });

    return res.status(201).json(
        new ApiResponse(201, { user }, "User registered successfully")
    );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await loginUserService({ email, password });

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user, accessToken },
                "User logged in successfully"
            )
        );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request - No Token provided");
    }

    const { accessToken, refreshToken } = await refreshAccessTokenService(incomingRefreshToken);

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { accessToken },
                "Access token refreshed successfully"
            )
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
    await logoutUserService(req.user._id);

    return res
        .status(200)
        .clearCookie("refreshToken", cookieOptions) // Clears the browser cookie
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

