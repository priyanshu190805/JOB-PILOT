import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                res.status(500).json({ message: "JWT_SECRET is not set on server." });
                return;
            }

            const decoded: any = jwt.verify(token, secret);

            // Get user from the token
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                res.status(401).json({ message: "User not found." });
                return;
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed." });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token." });
    }
};
