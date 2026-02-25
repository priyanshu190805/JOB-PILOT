import { Router } from "express";
import { setupCompany, getMyCompany } from "../controllers/companyController";
import { protect } from "../middleware/authMiddleware";
import upload from "../config/s3Service";

const router = Router();

router.post("/setup", protect, upload.single("logo"), setupCompany);

router.get("/my-company", protect, getMyCompany);

export default router;
