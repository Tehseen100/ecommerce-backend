import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const authHeader = req.header("Authorization");
    // console.log({ authHeader });

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized request - No token provided");
    }

    const token = authHeader.replace("Bearer ", "");

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired access token");
    }

    const user = await User.findById(decodedToken._id);
    if (!user) {
        throw new ApiError(401, "Unauthorized request - User not found");
    }
    req.user = user;
    next();
});