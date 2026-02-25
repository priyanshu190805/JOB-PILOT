import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
    createJob,
    getMyJobs,
    getJobById,
    updateJob,
    deleteJob
} from "../controllers/jobController";

const router = Router();

router.post("/", protect, createJob);
router.get("/my-jobs", protect, getMyJobs);
router.get("/:id", getJobById);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

export default router;
