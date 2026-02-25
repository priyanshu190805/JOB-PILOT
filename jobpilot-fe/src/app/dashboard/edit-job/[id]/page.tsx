"use client";

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Dropdown from "@/components/Dropdown";
import {
    JobRole, SalaryType, EducationLevel, ExperienceLevel,
    JobType, JobLevel
} from "@/types/enums";
import { Country, State } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getJobById, updateJob, clearJobStatus } from "@/store/jobSlice";

export default function EditJobPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const id = params.id as string;

    const { token } = useSelector((state: RootState) => state.auth);
    const { currentJob, loading, error, success } = useSelector((state: RootState) => state.jobs);

    console.log(currentJob);

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
        dispatch(clearJobStatus());
        if (id && token) {
            dispatch(getJobById({ id, token }));
        }
    }, [id, token, dispatch]);

    useEffect(() => {
        if (success) {
            router.push(`/dashboard/my-jobs/${id}`);
            dispatch(clearJobStatus());
        }
    }, [success, id, router, dispatch]);

    useEffect(() => {
        if (currentJob && (currentJob._id === id || currentJob.id === id)) {
            setFormData({
                jobTitle: currentJob.jobTitle || "",
                tags: currentJob.tags?.join(", ") || "",
                jobRole: currentJob.jobRole || "",
                minSalary: currentJob.minSalary?.toString() || "",
                maxSalary: currentJob.maxSalary?.toString() || "",
                salaryType: currentJob.salaryType || "Yearly",
                educationLevel: currentJob.educationLevel || "",
                experienceLevel: currentJob.experienceLevel || "",
                jobType: currentJob.jobType || "",
                jobLevel: currentJob.jobLevel || "",
                expirationDate: currentJob.expirationDate ? new Date(currentJob.expirationDate).toISOString().split('T')[0] : "",
                country: currentJob.country || "",
                state: (currentJob as any).state || "",
                currency: (currentJob as any).currency || "",
                isRemote: currentJob.isRemote || false,
                description: currentJob.description || "",
                requirements: currentJob.requirements || "",
            });
        }
    }, [currentJob, id]);

    useEffect(() => {
        if (formData.country) {
            const countryObj = allCountries.find(c => c.name === formData.country);
            if (countryObj) {
                setStates(State.getStatesOfCountry(countryObj.isoCode));
                // Only set default currency if we don't have one (initial load preservation)
                if (!formData.currency) {
                    setFormData(prev => ({ ...prev, currency: countryObj.currency }));
                }
            }
        } else {
            setStates([]);
        }
    }, [formData.country, allCountries]);

    const handleSave = () => {
        if (id && token) {
            dispatch(updateJob({ id, jobData: formData, token }));
        }
    };

    if (loading && !currentJob) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    return (
        <div className="w-full px-4 md:px-0 max-w-[1240px] mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-[1.25rem] font-semibold text-gray-800">Edit Job Details</h1>
                <div className="flex items-center gap-3 sm:gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.back()}
                        className="h-[44px] flex-1 sm:flex-none px-6 rounded-xl border border-gray-200 text-gray-600 text-[15px] font-medium hover:bg-gray-50 transition-all text-center"
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        disabled={loading}
                        className="h-[44px] flex-1 sm:flex-none px-6 sm:px-8 rounded-xl bg-[#4F46E5] text-white text-[15px] font-medium hover:bg-[#4338CA] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? "Saving..." : "Save"}
                    </motion.button>
                </div>
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
                        <label className="text-[13px] font-medium text-gray-500">Job Title</label>
                        <input type="text" className="w-full h-[48px] px-4 rounded-xl border border-gray-200 outline-none focus:border-[#4F46E5] transition-all text-gray-700" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[13px] font-medium text-gray-500">Tags</label>
                        <input type="text" className="w-full h-[48px] px-4 rounded-xl border border-gray-200 outline-none focus:border-[#4F46E5] transition-all text-gray-700" placeholder="Tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[13px] font-medium text-gray-500">Job Role</label>
                        <Dropdown value={formData.jobRole} options={Object.values(JobRole)} onChange={(v) => setFormData({ ...formData, jobRole: v })} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-[1.1rem] font-semibold text-gray-900 border-t border-gray-50 pt-6">Salary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-gray-500">Min Salary</label>
                            <div className="flex items-center w-full h-[48px] rounded-xl border border-gray-200 focus-within:border-[#4F46E5] transition-all overflow-hidden">
                                <input type="text" className="flex-1 h-full px-4 outline-none text-gray-700" value={formData.minSalary} onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-gray-500">Max Salary</label>
                            <div className="flex items-center w-full h-[48px] rounded-xl border border-gray-200 focus-within:border-[#4F46E5] transition-all overflow-hidden">
                                <input type="text" className="flex-1 h-full px-4 outline-none text-gray-700" value={formData.maxSalary} onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-gray-500">Currency</label>
                            <Dropdown value={formData.currency} options={allCurrencies} searchable={true} onChange={(v) => setFormData({ ...formData, currency: v })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-gray-500">Salary Type</label>
                            <Dropdown value={formData.salaryType} options={Object.values(SalaryType)} onChange={(v) => setFormData({ ...formData, salaryType: v })} />
                        </div>
                    </div>
                </div>

                {/* Advance Information */}
                <div className="space-y-4">
                    <h2 className="text-[1.1rem] font-semibold text-gray-900 border-t border-gray-50 pt-6">Advance Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-gray-500">Education Level</label>
                            <Dropdown value={formData.educationLevel} options={Object.values(EducationLevel)} onChange={(v) => setFormData({ ...formData, educationLevel: v })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-gray-500">Experience Level</label>
                            <Dropdown value={formData.experienceLevel} options={Object.values(ExperienceLevel)} onChange={(v) => setFormData({ ...formData, experienceLevel: v })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-gray-500">Job Type</label>
                            <Dropdown value={formData.jobType} options={Object.values(JobType)} onChange={(v) => setFormData({ ...formData, jobType: v })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-gray-500">Job Level</label>
                            <Dropdown value={formData.jobLevel} options={Object.values(JobLevel)} onChange={(v) => setFormData({ ...formData, jobLevel: v })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-gray-500">Expiration Date</label>
                            <div className="relative">
                                <input type="date" className="w-full h-[48px] px-4 rounded-xl border border-gray-100 outline-none focus:border-[#4F46E5] transition-all text-gray-700" value={formData.expirationDate} onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-[1.1rem] font-semibold text-gray-900 border-t border-gray-50 pt-6">Location</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-gray-500">Country</label>
                            <Dropdown value={formData.country} options={allCountries.map(c => c.name)} searchable={true} onChange={(v) => setFormData({ ...formData, country: v, state: "" })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-gray-500">State</label>
                            <Dropdown value={formData.state} options={states.map(s => s.name)} searchable={true} onChange={(v) => setFormData({ ...formData, state: v })} />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <div
                            className={`w-[18px] h-[18px] rounded border flex items-center justify-center cursor-pointer transition-all ${formData.isRemote ? "bg-[#4F46E5] border-[#4F46E5]" : "border-gray-300"}`}
                            onClick={() => setFormData({ ...formData, isRemote: !formData.isRemote })}
                        >
                            {formData.isRemote && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4.5L3.5 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            )}
                        </div>
                        <span className="text-[14px] text-gray-500 font-medium">Fully remote position</span>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-6">
                    <h2 className="text-[1.1rem] font-semibold text-gray-900 border-t border-gray-50 pt-6">Job Description</h2>
                    <textarea
                        className="w-full min-h-[180px] p-4 rounded-xl border border-gray-100 outline-none focus:border-[#4F46E5] transition-all text-gray-700 placeholder-gray-400"
                        placeholder="Add job description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                {/* Requirements */}
                <div className="space-y-6 pb-12">
                    <h2 className="text-[1.1rem] font-semibold text-gray-900 border-t border-gray-50 pt-6">Job Requirements</h2>
                    <textarea
                        className="w-full min-h-[140px] p-4 rounded-xl border border-gray-100 outline-none focus:border-[#4F46E5] transition-all text-gray-700 placeholder-gray-400"
                        placeholder="Enter requirements line by line (each line will be a bullet point)"
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}
