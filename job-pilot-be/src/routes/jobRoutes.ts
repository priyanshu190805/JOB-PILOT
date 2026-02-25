import { Router, Response } from "express";
import { protect, AuthRequest } from "../middleware/authMiddleware";
import Job from "../models/Job";
import Company from "../models/Company";

const router = Router();

const getTimeStatus = (expirationDate: Date): string => {
    if (!expirationDate) return "";
    const now = new Date();
    const expiry = new Date(expirationDate);

    if (isNaN(expiry.getTime())) return "";

    const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const d2 = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());

    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Expiring Today";
    if (diffDays === 1) return "Expiring Tomorrow";
    return `Expiring in ${diffDays} days`;
};

router.post("/", protect, async (req: AuthRequest, res: Response) => {
    try {
        const company = await Company.findOne({ userId: req.user.id });
        if (!company) {
            res.status(400).json({ message: "Please complete your account setup before posting a job." });
            return;
        }

        const {
            jobTitle,
            tags,
            jobRole,
            minSalary,
            maxSalary,
            salaryType,
            currency,
            educationLevel,
            experienceLevel,
            jobType,
            jobLevel,
            expirationDate,
            country,
            state,
            isRemote,
            description,
            requirements,
        } = req.body;

        const parseSalary = (val: any) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
                return Number(val.replace(/[^0-9.]/g, ''));
            }
            return 0;
        };

        let processedTags: string[] = [];
        if (typeof tags === "string") {
            processedTags = tags.split(/[ ,]+/).filter(tag => tag.trim().length > 0);
        } else if (Array.isArray(tags)) {
            processedTags = tags;
        }

        const newJob = await Job.create({
            employerId: req.user.id,
            companyId: company._id,
            jobTitle,
            tags: processedTags,
            jobRole,
            minSalary: parseSalary(minSalary),
            maxSalary: parseSalary(maxSalary),
            salaryType,
            currency,
            educationLevel,
            experienceLevel,
            jobType,
            jobLevel,
            expirationDate: new Date(expirationDate),
            country,
            state,
            isRemote,
            description,
            requirements,
        });

        res.status(201).json({
            ...newJob.toObject(),
            timeStatus: getTimeStatus(newJob.expirationDate)
        });
    } catch (err: any) {
        console.error(err);
        if (err.name === "ValidationError") {
            res.status(400).json({ message: err.message, errors: err.errors });
            return;
        }
        res.status(500).json({ message: "Server error while posting job." });
    }
});

router.get("/my-jobs", protect, async (req: AuthRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const query: any = { employerId: req.user.id };

        if (req.query.search) {
            const searchRegex = { $regex: req.query.search, $options: "i" };
            query.$or = [
                { jobTitle: searchRegex },
                { jobRole: searchRegex },
                { educationLevel: searchRegex },
                { country: searchRegex },
                { city: searchRegex }
            ];
        }

        const { jobType, jobLevel, educationLevel, experienceLevel, isRemote, status } = req.query;

        if (jobType) query.jobType = jobType;
        if (jobLevel) query.jobLevel = jobLevel;
        if (educationLevel) query.educationLevel = educationLevel;
        if (experienceLevel) query.experienceLevel = experienceLevel;
        if (status) query.status = status;
        if (isRemote !== undefined) query.isRemote = isRemote === "true";

        const totalJobs = await Job.countDocuments(query);
        const jobs = await Job.find(query)
            .populate("companyId", "companyName logo location")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const jobsWithStatus = jobs.map(job => ({
            ...job.toObject(),
            timeStatus: getTimeStatus(job.expirationDate)
        }));

        res.json({
            jobs: jobsWithStatus,
            pagination: {
                totalJobs,
                totalPages: Math.ceil(totalJobs / limit),
                currentPage: page,
                limit
            }
        });
    } catch (err) {
        console.error("Error fetching my jobs:", err);
        res.status(500).json({ message: "Server error while fetching your jobs." });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("companyId", "companyName logo location aboutUs industryType teamSize phone email");

        if (!job) {
            res.status(404).json({ message: "Job not found." });
            return;
        }

        res.json({
            ...job.toObject(),
            timeStatus: getTimeStatus(job.expirationDate)
        });
    } catch (err) {
        console.error("Error fetching job details:", err);
        res.status(500).json({ message: "Server error while fetching job details." });
    }
});

router.put("/:id", protect, async (req: AuthRequest, res: Response) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            res.status(404).json({ message: "Job not found." });
            return;
        }

        if (job.employerId.toString() !== req.user.id) {
            res.status(401).json({ message: "User not authorized to update this job." });
            return;
        }

        const {
            jobTitle,
            tags,
            jobRole,
            minSalary,
            maxSalary,
            salaryType,
            currency,
            educationLevel,
            experienceLevel,
            jobType,
            jobLevel,
            expirationDate,
            country,
            state,
            isRemote,
            description,
            requirements,
        } = req.body;

        const parseSalary = (val: any) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
                return Number(val.replace(/[^0-9.]/g, ''));
            }
            return 0;
        };

        let processedTags: string[] = [];
        if (typeof tags === "string") {
            processedTags = tags.split(/[ ,]+/).filter(tag => tag.trim().length > 0);
        } else if (Array.isArray(tags)) {
            processedTags = tags;
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            {
                jobTitle,
                tags: processedTags,
                jobRole,
                minSalary: parseSalary(minSalary),
                maxSalary: parseSalary(maxSalary),
                salaryType,
                currency,
                educationLevel,
                experienceLevel,
                jobType,
                jobLevel,
                expirationDate: expirationDate ? new Date(expirationDate) : job.expirationDate,
                country,
                state,
                isRemote,
                description,
                requirements,
            },
            { new: true, runValidators: true }
        );

        if (!updatedJob) {
            res.status(404).json({ message: "Job not found after update." });
            return;
        }

        res.json({
            ...updatedJob.toObject(),
            timeStatus: getTimeStatus(updatedJob.expirationDate)
        });
    } catch (err: any) {
        console.error("Error updating job:", err);
        if (err.name === "ValidationError") {
            res.status(400).json({ message: err.message, errors: err.errors });
            return;
        }
        res.status(500).json({ message: "Server error while updating job." });
    }
});

router.delete("/:id", protect, async (req: AuthRequest, res: Response) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            res.status(404).json({ message: "Job not found." });
            return;
        }

        if (job.employerId.toString() !== req.user.id) {
            res.status(401).json({ message: "User not authorized to delete this job." });
            return;
        }

        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: "Job deleted successfully." });
    } catch (err) {
        console.error("Error deleting job:", err);
        res.status(500).json({ message: "Server error while deleting job." });
    }
});

export default router;
