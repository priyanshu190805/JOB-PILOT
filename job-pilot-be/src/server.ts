import express, { Application, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db";

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
    res.json({ message: "JobPilot API is running 🚀" });
});

import authRoutes from "./routes/authRoutes";
import companyRoutes from "./routes/companyRoutes";
import jobRoutes from "./routes/jobRoutes";
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);

// ── Connect to MongoDB & start server ─────────────────────────────────────────
connectDB(app, PORT);
