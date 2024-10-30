import {User} from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const {name,email,password} = req.body;

    try{
        if(!name || !email || !password){
            throw new Error("Please fill all fields")
        }

        const user_exists = await User.findOne({email})
        if(user_exists){
            throw new Error("User already exist")
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new Error(
                "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters."
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        

        
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            })

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            user.refreshToken = refreshToken;

            await user.save();

        

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(201).json({ success: true,
            message: "User created successfully",
            user:{
                ...user._doc,
                password: undefined,
                _id: undefined,
                refreshToken: undefined,   
            },
            accessToken });
    }catch(error){
        res.status(400).json({success:false, message:error.message})
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });

        res.json({ success: true, accessToken });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    const { refreshToken } = req.cookies;

    try {
        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.clearCookie("refreshToken");
        res.status(200).json({ success: true, message: "Logged out" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) return res.status(401).json({ message: "Authentication required" });

    try {
        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ message: "Invalid refresh token" });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token" });

            const accessToken = generateAccessToken(user);
            res.json({ success: true, accessToken });
        });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
}