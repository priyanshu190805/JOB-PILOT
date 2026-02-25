import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Company from "../models/Company";

export const setupCompany = async (req: AuthRequest, res: Response) => {
    try {
        const {
            companyName,
            orgType,
            industryType,
            teamSize,
            yearEstablished,
            aboutUs,
            location,
            phone,
            email
        } = req.body;

        const userId = req.user.id;
        const logo = (req.file as any)?.location; // URL from S3

        // Validate required fields (except logo)
        if (!companyName || !orgType || !industryType || !teamSize || !yearEstablished || !aboutUs || !location || !phone || !email) {
            res.status(400).json({ message: "All required fields must be provided." });
            return;
        }

        // Create new company profile
        const company = await Company.create({
            userId,
            companyName,
            orgType,
            industryType,
            teamSize,
            yearEstablished,
            aboutUs,
            location,
            phone,
            email,
            logo
        });

        res.status(200).json({
            message: "Company profile saved successfully!",
            company
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};

export const getMyCompany = async (req: AuthRequest, res: Response) => {
    try {
        const company = await Company.findOne({ userId: req.user.id });
        if (!company) {
            res.status(404).json({ message: "Company profile not found." });
            return;
        }
        res.json(company);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching company profile." });
    }
};
