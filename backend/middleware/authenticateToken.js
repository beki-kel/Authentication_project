import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import dotenv from 'dotenv';
import { generateAccessToken } from '../utils/generateTokens.js';

dotenv.config();

export const authenticateToken = async (req, res, next) => {
    const accessToken = req.cookies.accessToken; 
    const refreshToken = req.cookies.refreshToken;

    // If no refresh token is present, return error
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: "Please log in" });
    }

    // If access token is present, verify it
    if (accessToken) {
        try {
            const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.user = user; 
            return next(); // Proceed if access token is valid
        } catch (err) {
        }
    }

    try {
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(401).json({ success: false, message: "Please log in" });
        }
        
        const newAccessToken = generateAccessToken(user);
        res.cookie("accessToken", newAccessToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 10 * 60 * 1000 
        });

        req.user = user; 
        return next(); 
    } catch (error) {
        return res.status(403).json({ success: false, message: error.message });
    }
};
