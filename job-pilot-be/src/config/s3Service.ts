import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";

dotenv.config();

// Debug check for credentials (masked for security)
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.warn("⚠️  AWS S3 WARNING: Missing ACCESS_KEY_ID or SECRET_ACCESS_KEY in .env");
} else {
    console.log("✅ AWS S3: Credentials detected from .env");
}

// AWS S3 Client Configuration
const s3 = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

// Multer Storage Configuration for S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME || "",
        metadata: (req: any, file: any, cb: any) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req: any, file: any, cb: any) => {
            const fileName = `logos/${Date.now()}_${file.originalname}`;
            cb(null, fileName);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed!"));
        }
    },
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    },
});

export default upload;
