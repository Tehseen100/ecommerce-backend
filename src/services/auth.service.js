import jwt from "jsonwebtoken";
import { env } from '../config/env.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export const registerUserService = async ({ name, email, password }) => {
    // Check if a user with the given email already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // Create the user (pre-save hook in the user model will handle password hashing)
    const user = await User.create({
        name,
        email,
        password
    });

    // Convert to object and remove sensitive fields before returning
    const createdUser = user.toObject();
    delete createdUser.password;
    delete createdUser.refreshToken;

    return createdUser;
}

export const loginUserService = async ({ email, password }) => {
    // Find the user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Check if password matches
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate tokens uing the methods defined in the user model
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save the refresh token to the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Convert to object and remove sensitive fields before returning
    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

    return { user: loggedInUser, accessToken, refreshToken };
}

export const refreshAccessTokenService = async (incomingRefreshToken) => {
    let decodedToken;
    try {
        decodedToken = jwt.verify(incomingRefreshToken, env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decodedToken._id).select('+refreshToken');
    if (!user || user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export const logoutUserService = async (userId) => {
    await User.findByIdAndUpdate(
        userId,
        { $unset: { refreshToken: 1 } }, // Remove the refreshToken field
    );
}

