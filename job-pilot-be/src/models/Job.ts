import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
    employerId: mongoose.Types.ObjectId;
    companyId: mongoose.Types.ObjectId;
    jobTitle: string;
    tags: string[];
    jobRole: string;
    minSalary: number;
    maxSalary: number;
    salaryType: "Yearly" | "Monthly" | "Weekly";
    currency: string;
    requirements: string;
    educationLevel: "Graduation" | "Post Graduation" | "PhD";
    experienceLevel: "1-2 years" | "2-5 years" | "5+ years";
    jobType: "Full Time" | "Part Time" | "Contract";
    jobLevel: "Entry Level" | "Mid Level" | "Senior Level";
    expirationDate: Date;
    country: string;
    state: string;
    isRemote: boolean;
    description: string;
    status: "Active" | "Expired" | "Draft";
    applicants: number;
}

const JobSchema = new Schema<IJob>(
    {
        employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
        jobTitle: { type: String, required: true, trim: true, minlength: 5 },
        tags: [{ type: String, trim: true }],
        jobRole: {
            type: String,
            required: true,
            enum: ["Designer", "Developer", "Manager", "Analyst"]
        },
        minSalary: { type: Number, required: true },
        maxSalary: { type: Number, required: true },
        salaryType: {
            type: String,
            required: true,
            enum: ["Yearly", "Monthly", "Weekly"]
        },
        currency: {
            type: String,
            required: true,
            default: "USD"
        },
        requirements: { type: String, default: "" },
        educationLevel: {
            type: String,
            required: true,
            enum: ["Graduation", "Post Graduation", "PhD"]
        },
        experienceLevel: {
            type: String,
            required: true,
            enum: ["1-2 years", "2-5 years", "5+ years"]
        },
        jobType: {
            type: String,
            required: true,
            enum: ["Full Time", "Part Time", "Contract"]
        },
        jobLevel: {
            type: String,
            required: true,
            enum: ["Entry Level", "Mid Level", "Senior Level"]
        },
        expirationDate: { type: Date, required: true },
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        isRemote: { type: Boolean, default: false },
        description: { type: String, required: true, minlength: 50 },
        status: {
            type: String,
            enum: ["Active", "Expired", "Draft"],
            default: "Active"
        },
        applicants: {
            type: Number,
            default: 10
        }
    },
    { timestamps: true }
);

export default mongoose.model<IJob>("Job", JobSchema);
