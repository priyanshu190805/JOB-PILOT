import mongoose, { Document, Schema } from "mongoose";

export enum OrgType {
    Private = "Private",
    Public = "Public",
    NonProfit = "Non-Profit",
    Government = "Government",
    Startup = "Startup"
}

export enum IndustryType {
    Technology = "Technology",
    Finance = "Finance",
    Healthcare = "Healthcare",
    Education = "Education",
    Retail = "Retail",
    Manufacturing = "Manufacturing",
    Other = "Other"
}

export enum TeamSize {
    Small = "1–10",
    Medium = "11–50",
    Large = "51–200",
    ExtraLarge = "201–500",
    Enterprise = "500+"
}

export interface ICompany extends Document {
    userId: mongoose.Types.ObjectId;
    companyName: string;
    orgType: OrgType;
    industryType: IndustryType;
    teamSize: TeamSize;
    yearEstablished: string;
    aboutUs: string;
    location: string;
    phone: string;
    email: string;
    logo?: string;
}

const CompanySchema = new Schema<ICompany>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        companyName: { type: String, required: true, trim: true },
        orgType: { type: String, enum: Object.values(OrgType), required: true },
        industryType: { type: String, enum: Object.values(IndustryType), required: true },
        teamSize: { type: String, enum: Object.values(TeamSize), required: true },
        yearEstablished: { type: String, required: true },
        aboutUs: { type: String, required: true },
        location: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        logo: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<ICompany>("Company", CompanySchema);
