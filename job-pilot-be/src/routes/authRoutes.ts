import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

const signToken = (id: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not set");
    return jwt.sign({ id }, secret, { expiresIn: "7d" });
};

router.post("/register", async (req: Request, res: Response) => {
    try {
        const { fullName, username, email, password } = req.body;

        if (!fullName || !username || !email || !password) {
            res.status(400).json({ message: "All fields are required." });
            return;
        }

        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            const field = existing.email === email.toLowerCase() ? "Email" : "Username";
            res.status(409).json({ message: `${field} is already in use.` });
            return;
        }

        const user = await User.create({ fullName, username, email, password });
        const token = signToken(user.id as string);

        res.status(201).json({
            token,
            user: { id: user.id, name: user.fullName, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;

        if ((!email && !username) || !password) {
            res.status(400).json({ message: "Email/Username and password are required." });
            return;
        }

        let user;
        if (email) {
            user = await User.findOne({ email: email.toLowerCase() });
        } else if (username) {
            user = await User.findOne({ username: username.toLowerCase() });
        }

        if (!user) {
            res.status(401).json({ message: "Invalid credentials." });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials." });
            return;
        }

        const token = signToken(user.id as string);

        res.json({
            token,
            user: { id: user.id, name: user.fullName, email: user.email, username: user.username },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

export default router;
