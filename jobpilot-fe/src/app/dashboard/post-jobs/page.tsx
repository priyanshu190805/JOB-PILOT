"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { postJob } from "@/store/jobSlice";
import { JobRole, SalaryType, EducationLevel, ExperienceLevel, JobType, JobLevel } from "@/types/enums";
import { Country, State } from "country-state-city";

export default function PostJobPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const { token } = useSelector((state: RootState) => state.auth);
    const { loading, error, success } = useSelector((state: RootState) => state.jobs);

    const [formData, setFormData] = useState({
        jobTitle: "",
        tags: "",
        jobRole: "",
        minSalary: "",
        maxSalary: "",
        salaryType: "Yearly",
        educationLevel: "",
        experienceLevel: "",
        jobType: "",
        jobLevel: "",
        expirationDate: "",
        country: "",
        state: "",
        currency: "",
        isRemote: false,
        description: "",
        requirements: "",
    });

    const [allCountries] = useState(Country.getAllCountries());
    const [states, setStates] = useState<any[]>([]);

    const allCurrencies = Array.from(new Set(allCountries.map(c => c.currency))).sort();

    useEffect(() => {
        if (formData.country) {
            const countryObj = allCountries.find(c => c.name === formData.country);
            if (countryObj) {
                setStates(State.getStatesOfCountry(countryObj.isoCode));
                setFormData(prev => ({ ...prev, currency: countryObj.currency }));
            }
        } else {
            setStates([]);
        }
        setFormData(prev => ({ ...prev, state: "" }));
    }, [formData.country, allCountries]);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (success) {
            router.push("/dashboard/my-jobs");
        }
    }, [success, router]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        const checkLength = (field: keyof typeof formData, label: string, minLen: number = 5) => {
            const value = formData[field];
            if (typeof value === "string") {
                if (!value.trim()) {
                    newErrors[field] = `${label} is required.`;
                } else if (value.trim().length < minLen) {
                    newErrors[field] = `${label} must be at least ${minLen} characters.`;
                }
            }
        };

        checkLength("jobTitle", "Job Title");
        checkLength("tags", "Tags");
        checkLength("description", "Description", 50);
        checkLength("requirements", "Requirements", 20);

        if (!formData.jobRole) newErrors.jobRole = "Job Role is required.";
        if (!formData.minSalary) {
            newErrors.minSalary = "Min Salary is required.";
        } else if (!/^\d+$/.test(formData.minSalary)) {
            newErrors.minSalary = "Min Salary must contain only numbers.";
        }

        if (!formData.maxSalary) {
            newErrors.maxSalary = "Max Salary is required.";
        } else if (!/^\d+$/.test(formData.maxSalary)) {
            newErrors.maxSalary = "Max Salary must contain only numbers.";
        }
        if (!formData.educationLevel) newErrors.educationLevel = "Education Level is required.";
        if (!formData.experienceLevel) newErrors.experienceLevel = "Experience Level is required.";
        if (!formData.jobType) newErrors.jobType = "Job Type is required.";
        if (!formData.jobLevel) newErrors.jobLevel = "Job Level is required.";
        if (!formData.expirationDate) newErrors.expirationDate = "Expiration Date is required.";
        if (!formData.currency) newErrors.currency = "Currency is required.";
        if (!formData.country) newErrors.country = "Country is required.";
        if (!formData.state) newErrors.state = "State is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePostJob = () => {
        if (validateForm() && token) {
            dispatch(postJob({ jobData: formData, token }));
        }
    };

    const inputCls = (field: string) =>
        `w-full h-[46px] px-4 rounded-xl border outline-none transition-all text-gray-700 placeholder-gray-400 ${errors[field] ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-100" : "border-gray-200 focus:border-[#4F46E5]"
        }`;

    return (
        <div className="max-w-[1240px] mx-auto pb-20">
            {/* Header */}
            <div className="mb-7">
                <h1 className="text-[24px] font-medium text-[#434348]">Post a Job</h1>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="bg-white space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[14px] font-medium text-[#7E7E86]">Job Title</label>
                        <input type="text" className={inputCls("jobTitle")} value={formData.jobTitle} onChange={(e) => {
                            setFormData({ ...formData, jobTitle: e.target.value });
                            if (errors.jobTitle) setErrors({ ...errors, jobTitle: "" });
                        }} />
                        {errors.jobTitle && <p className="text-xs text-red-500 mt-1">{errors.jobTitle}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[14px] text-[#7E7E86]">Tags</label>
                        <input type="text" className={inputCls("tags")} value={formData.tags} onChange={(e) => {
                            setFormData({ ...formData, tags: e.target.value });
                            if (errors.tags) setErrors({ ...errors, tags: "" });
                        }} />
                        {errors.tags && <p className="text-xs text-red-500 mt-1">{errors.tags}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[14px] text-[#7E7E86]">Job Role</label>
                        <Dropdown value={formData.jobRole} options={Object.values(JobRole)} placeholder="Select" onChange={(v) => {
                            setFormData({ ...formData, jobRole: v });
                            if (errors.jobRole) setErrors({ ...errors, jobRole: "" });
                        }} />
                        {errors.jobRole && <p className="text-xs text-red-500 mt-1">{errors.jobRole}</p>}
                    </div>
                </div>

                {/* Salary */}
                <div className="space-y-3">
                    <h2 className="text-[18px] font-medium text-[#434348] border-t border-gray-50 pt-6 first:border-0 first:pt-0">Salary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-[14px] text-[#7E7E86]">Min Salary</label>
                            <input type="text" className={inputCls("minSalary")} value={formData.minSalary} onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                setFormData({ ...formData, minSalary: val });
                                if (errors.minSalary) setErrors({ ...errors, minSalary: "" });
                            }} />
                            {errors.minSalary && <p className="text-xs text-red-500 mt-1">{errors.minSalary}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[14px] text-[#7E7E86]">Max Salary</label>
                            <input type="text" className={inputCls("maxSalary")} value={formData.maxSalary} onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                setFormData({ ...formData, maxSalary: val });
                                if (errors.maxSalary) setErrors({ ...errors, maxSalary: "" });
                            }} />
                            {errors.maxSalary && <p className="text-xs text-red-500 mt-1">{errors.maxSalary}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[14px] text-[#7E7E86]">Currency</label>
                            <Dropdown
                                value={formData.currency}
                                options={allCurrencies}
                                searchable={true}
                                placeholder="Currency"
                                onChange={(v) => {
                                    setFormData({ ...formData, currency: v });
                                    if (errors.currency) setErrors({ ...errors, currency: "" });
                                }}
                            />
                            {errors.currency && <p className="text-xs text-red-500 mt-1">{errors.currency}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[14px] text-[#7E7E86]">Salary Type</label>
                            <Dropdown value={formData.salaryType} options={Object.values(SalaryType)} placeholder="Select" onChange={(v) => setFormData({ ...formData, salaryType: v })} />
                        </div>
                    </div>
                </div>

                {/* Advance Info */}
                <div className="space-y-4">
                    <h2 className="text-[18px] font-medium text-[#434348] border-t border-gray-50">Advance Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
                        <div className="space-y-2">
                            <label className="text-[14px] text-[#7E7E86]">Education Level</label>
                            <Dropdown value={formData.educationLevel} options={Object.values(EducationLevel)} placeholder="Select" onChange={(v) => {
                                setFormData({ ...formData, educationLevel: v });
                                if (errors.educationLevel) setErrors({ ...errors, educationLevel: "" });
                            }} />
                            {errors.educationLevel && <p className="text-xs text-red-500 mt-1">{errors.educationLevel}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[14px] text-[#7E7E86]">Experience Level</label>
                            <Dropdown value={formData.experienceLevel} options={Object.values(ExperienceLevel)} placeholder="Select" onChange={(v) => {
                                setFormData({ ...formData, experienceLevel: v });
                                if (errors.experienceLevel) setErrors({ ...errors, experienceLevel: "" });
                            }} />
                            {errors.experienceLevel && <p className="text-xs text-red-500 mt-1">{errors.experienceLevel}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[14px] text-[#7E7E86]">Job Type</label>
                            <Dropdown value={formData.jobType} options={Object.values(JobType)} placeholder="Select" onChange={(v) => {
                                setFormData({ ...formData, jobType: v });
                                if (errors.jobType) setErrors({ ...errors, jobType: "" });
                            }} />
                            {errors.jobType && <p className="text-xs text-red-500 mt-1">{errors.jobType}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[14px] text-[#7E7E86]">Job Level</label>
                            <Dropdown value={formData.jobLevel} options={Object.values(JobLevel)} placeholder="Select" onChange={(v) => {
                                setFormData({ ...formData, jobLevel: v });
                                if (errors.jobLevel) setErrors({ ...errors, jobLevel: "" });
                            }} />
                            {errors.jobLevel && <p className="text-xs text-red-500 mt-1">{errors.jobLevel}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[14px] text-[#7E7E86]">Expiration Date</label>
                            <div
                                className={`relative flex items-center w-full h-[48px] rounded-xl border transition-all cursor-pointer ${errors.expirationDate ? "border-red-400 bg-red-50/10" : "border-gray-200 focus-within:border-[#4F46E5] bg-white"
                                    }`}
                                onClick={(e) => {
                                    const input = e.currentTarget.querySelector("input");
                                    if (input && "showPicker" in input) {
                                        input.showPicker();
                                    }
                                }}
                            >
                                <input
                                    type="date"
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                    value={formData.expirationDate}
                                    onChange={(e) => {
                                        setFormData({ ...formData, expirationDate: e.target.value });
                                        if (errors.expirationDate) setErrors({ ...errors, expirationDate: "" });
                                    }}
                                />
                                <div className="flex-1 px-4 text-gray-700 text-[14px]">
                                    {formData.expirationDate ? (
                                        new Date(formData.expirationDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric"
                                        })
                                    ) : (
                                        <span className="text-gray-400">dd/mm/yyyy</span>
                                    )}
                                </div>
                                <CalendarIcon size={18} className="mr-4 text-gray-400 shrink-0" />
                            </div>
                            {errors.expirationDate && <p className="text-xs text-red-500 mt-1">{errors.expirationDate}</p>}
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                    <h2 className="text-[18px] font-medium text-[#434348] border-t border-gray-50">Location</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[14px] text-[#7E7E86]">Country</label>
                            <Dropdown value={formData.country} options={allCountries.map(c => c.name)} placeholder="Select Country" searchable={true} onChange={(v) => {
                                setFormData({ ...formData, country: v });
                                if (errors.country) setErrors({ ...errors, country: "" });
                            }} />
                            {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[14px] text-[#7E7E86]">State</label>
                            <Dropdown value={formData.state} options={states.map(s => s.name)} placeholder="Select State" searchable={true} onChange={(v) => {
                                setFormData({ ...formData, state: v });
                                if (errors.state) setErrors({ ...errors, state: "" });
                            }} />
                            {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <div className={`w-[18px] h-[18px] rounded border flex items-center justify-center cursor-pointer transition-all ${formData.isRemote ? "bg-[#4F46E5] border-[#4F46E5]" : "border-gray-300"}`} onClick={() => setFormData({ ...formData, isRemote: !formData.isRemote })}>
                            {formData.isRemote && (<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4.5L3.5 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
                        </div>
                        <span className="text-[14px] text-gray-500 font-medium">Fully remote position</span>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-6">
                    <h2 className="text-[18px] font-medium text-[#434348] border-t border-gray-50">Job Description</h2>
                    <textarea className={`w-full min-h-[180px] p-4 rounded-xl border outline-none transition-all text-gray-700 placeholder-gray-400 ${errors.description ? "border-red-400 focus:border-red-400" : "border-gray-100 focus:border-[#4F46E5]"}`} placeholder="Add job description" value={formData.description} onChange={(e) => {
                        setFormData({ ...formData, description: e.target.value });
                        if (errors.description) setErrors({ ...errors, description: "" });
                    }} />
                    {errors.description && <p className="text-xs text-red-500 mt-0.5">{errors.description}</p>}
                </div>

                {/* Requirements */}
                <div className="space-y-6">
                    <h2 className="text-[18px] font-medium text-[#434348] border-t border-gray-50">Job Requirements</h2>
                    <textarea className={`w-full min-h-[140px] p-4 rounded-xl border outline-none transition-all text-gray-700 placeholder-gray-400 ${errors.requirements ? "border-red-400 focus:border-red-400" : "border-gray-100 focus:border-[#4F46E5]"}`} placeholder="Enter requirements line by line (each line will be a bullet point)" value={formData.requirements} onChange={(e) => {
                        setFormData({ ...formData, requirements: e.target.value });
                        if (errors.requirements) setErrors({ ...errors, requirements: "" });
                    }} />
                    {errors.requirements && <p className="text-xs text-red-500 mt-0.5">{errors.requirements}</p>}
                </div>

                <div className="pt-6">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePostJob}
                        disabled={loading}
                        className="h-[46px] px-10 rounded-3xl bg-[#5C63ED] text-white text-[16px] font-medium hover:bg-[#4E55D4] transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Posting...
                            </>
                        ) : "Post Job"}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
