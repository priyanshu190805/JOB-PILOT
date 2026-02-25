"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlusCircle, Loader2, Search } from "lucide-react";
import JobTable from "@/components/JobTable";
import JobCard from "@/components/JobCard";
import DeleteModal from "@/components/ConfirmationModal";
import Dropdown from "@/components/Dropdown";
import { type Job } from "@/types/job";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getJobs, deleteJob } from "@/store/jobSlice";

export default function MyJobsPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { token } = useSelector((state: RootState) => state.auth);
    const { jobs, loading, error, pagination } = useSelector((state: RootState) => state.jobs);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [jobToDelete, setJobToDelete] = useState<any | null>(null);

    const [filters, setFilters] = useState({
        jobType: "",
        jobLevel: "",
        educationLevel: "",
        experienceLevel: "",
        status: "",
        isRemote: "" as string | boolean,
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (token) {
            dispatch(getJobs({
                token,
                page,
                limit: 5,
                search: debouncedSearch,
                filters: {
                    ...filters,
                    isRemote: filters.isRemote === "true" ? true : filters.isRemote === "false" ? false : undefined
                }
            }));
        }
    }, [dispatch, token, page, debouncedSearch, filters]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filters]);

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            jobType: "",
            jobLevel: "",
            educationLevel: "",
            experienceLevel: "",
            status: "",
            isRemote: "",
        });
        setSearch("");
    };

    const handleDeleteConfirm = () => {
        if (jobToDelete?.id && token) {
            dispatch(deleteJob({ id: jobToDelete.id.toString(), token }));
        }
        setJobToDelete(null);
    };

    const formattedJobs: Job[] = (jobs || []).map((j: any) => ({
        id: j._id,
        title: j.jobTitle,
        type: j.jobType,
        applicants: j.applicants || 0,
        status: j.status === "Expired" ? "Expired" : j.status === "Draft" ? "Draft" : "Active",
        remaining: j.timeStatus || ""
    }));

    const activeFiltersCount = Object.values(filters).filter(v => v !== "").length + (search ? 1 : 0);

    return (
        <div className="flex-1 flex flex-col space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[1.25rem] font-semibold text-gray-900">My Jobs</h1>
                </div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link href="/dashboard/post-jobs" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4F46E5] text-white rounded-xl font-semibold hover:bg-[#4338CA] transition-colors text-sm shadow-sm">
                        <PlusCircle size={18} />
                        Post New Job
                    </Link>
                </motion.div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-grow w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title, role, education, or location..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14.5px] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`md:hidden flex-grow px-4 py-3 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-all ${isFilterOpen ? "bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]" : "bg-white border-gray-200 text-gray-600"}`}
                        >
                            {isFilterOpen ? "Hide Filters" : "Advanced Filters"}
                            {activeFiltersCount > 0 && (
                                <span className="w-5 h-5 flex items-center justify-center bg-[#4F46E5] text-white text-[10px] rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={clearFilters}
                            disabled={activeFiltersCount === 0}
                            className={`text-sm font-medium transition-colors whitespace-nowrap px-2 ${activeFiltersCount > 0 ? "text-red-500 hover:text-red-600 cursor-pointer" : "text-gray-300 cursor-not-allowed"}`}
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                <div className={`${isFilterOpen ? "grid" : "hidden"} md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 animate-in fade-in slide-in-from-top-2 md:animate-none`}>
                    {/* Job Type */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Type</label>
                        <Dropdown
                            value={filters.jobType || "All Types"}
                            onChange={(v) => handleFilterChange("jobType", v === "All Types" ? "" : v)}
                            options={["All Types", "Full Time", "Part Time", "Contract"]}
                        />
                    </div>

                    {/* Job Level */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Level</label>
                        <Dropdown
                            value={filters.jobLevel || "All Levels"}
                            onChange={(v) => handleFilterChange("jobLevel", v === "All Levels" ? "" : v)}
                            options={["All Levels", "Entry Level", "Mid Level", "Senior Level"]}
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status</label>
                        <Dropdown
                            value={filters.status || "All Statuses"}
                            onChange={(v) => handleFilterChange("status", v === "All Statuses" ? "" : v)}
                            options={["All Statuses", "Active", "Expired", "Draft"]}
                        />
                    </div>

                    {/* Work Type */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Work Type</label>
                        <Dropdown
                            value={filters.isRemote === "" ? "Any" : filters.isRemote === "true" || filters.isRemote === true ? "Remote Only" : "On-site Only"}
                            onChange={(v) => handleFilterChange("isRemote", v === "Any" ? "" : v === "Remote Only" ? "true" : "false")}
                            options={["Any", "Remote Only", "On-site Only"]}
                        />
                    </div>

                    {/* Experience */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Experience</label>
                        <Dropdown
                            value={filters.experienceLevel || "Any Experience"}
                            onChange={(v) => handleFilterChange("experienceLevel", v === "Any Experience" ? "" : v)}
                            options={["Any Experience", "1-2 years", "2-5 years", "5+ years"]}
                        />
                    </div>

                    {/* Education */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Education</label>
                        <Dropdown
                            value={filters.educationLevel || "Any Education"}
                            onChange={(v) => handleFilterChange("educationLevel", v === "Any Education" ? "" : v)}
                            options={["Any Education", "Graduation", "Post Graduation", "PhD"]}
                        />
                    </div>

                    {/* Reset Button */}
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            disabled={activeFiltersCount === 0}
                            className={`w-full h-[46px] rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all
                                ${activeFiltersCount > 0
                                    ? "bg-red-50 border-red-100 text-red-600 hover:bg-red-100"
                                    : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"}`}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-grow">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <Loader2 size={32} className="text-[#4F46E5] animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Fetching your jobs...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-center">
                        <p className="text-red-600 font-medium">{error}</p>
                        <button
                            onClick={() => token && dispatch(getJobs({ token, page, limit: 5 }))}
                            className="mt-4 px-6 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-semibold"
                        >
                            Try Again
                        </button>
                    </div>
                ) : formattedJobs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-gray-500 mb-6">You haven't posted any jobs yet.</p>
                        <Link href="/dashboard/post-jobs" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-3xl font-semibold hover:bg-[#4338CA] transition-colors">
                            <PlusCircle size={20} />
                            Post a Job
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <JobTable jobs={formattedJobs} onDelete={(job) => setJobToDelete(job)} />
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {formattedJobs.map((job) => (
                                <JobCard key={job.id} job={job} onDelete={(job) => setJobToDelete(job)} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Pagination Options */}
            {pagination && pagination.totalPages > 1 ? (
                <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="h-[40px] px-4 rounded-xl border border-gray-200 text-gray-600 text-[14px] font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-1.5 mx-4">
                        {[...Array(pagination.totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setPage(i + 1)}
                                className={`w-[40px] h-[40px] rounded-xl text-[14px] font-semibold transition-all ${page === i + 1
                                    ? "bg-[#4F46E5] text-white shadow-sm"
                                    : "text-gray-500 hover:bg-gray-100"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        className="h-[40px] px-4 rounded-xl border border-gray-200 text-gray-600 text-[14px] font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Next
                    </button>
                </div>
            ) : <div className="h-4" />}

            <DeleteModal
                isOpen={!!jobToDelete}
                onClose={() => setJobToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Job"
                message={`Are you sure you want to delete "${jobToDelete?.title || "this job"}"? This action cannot be undone.`}
            />
        </div>
    );
}
