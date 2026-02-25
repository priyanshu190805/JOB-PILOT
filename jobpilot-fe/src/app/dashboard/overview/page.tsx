"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";
import JobTable from "@/components/JobTable";
import JobCard from "@/components/JobCard";
import DeleteModal from "@/components/ConfirmationModal";
import { type Job } from "@/types/job";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getJobs, deleteJob } from "@/store/jobSlice";

export default function OverviewPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);

    const [jobToDelete, setJobToDelete] = useState<any | null>(null);

    useEffect(() => {
        if (token) {
            dispatch(getJobs({ token, limit: 5 }));
        }
    }, [dispatch, token]);

    const handleDeleteConfirm = () => {
        if (jobToDelete?.id && token) {
            dispatch(deleteJob({ id: jobToDelete.id.toString(), token }));
        }
        setJobToDelete(null);
    };

    const openJobsCount = jobs.filter((j: any) => j.status === "Active").length;

    const formattedJobs: Job[] = jobs.map((j: any) => ({
        id: j._id,
        title: j.jobTitle,
        type: j.jobType,
        applicants: j.applicants || 0,
        status: j.status === "Expired" ? "Expired" : j.status === "Draft" ? "Draft" : "Active",
        remaining: j.timeStatus || ""
    }));

    return (
        <div className="space-y-10">
            {/* Welcome header */}
            <div>
                <h1 className="text-[1.75rem] font-semibold text-gray-900 leading-tight">
                    Hello, {user?.name || "Designic"} 👋
                </h1>
                <p className="text-[0.9rem] text-gray-500 mt-1">
                    Here is your daily activity and job overview.
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-5 max-w-lg">
                <div className="bg-[#E5E6FB] p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-[2rem] font-bold text-gray-900">
                            {loading ? "..." : openJobsCount}
                        </p>
                        <p className="text-[0.875rem] text-gray-600 font-medium mt-0.5">Open Jobs</p>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Briefcase size={19} className="text-indigo-500" />
                    </div>
                </div>
            </div>

            {/* Recent jobs */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-[1rem] font-semibold text-gray-800">Recently Posted Jobs</h2>
                    <Link href="/dashboard/my-jobs" className="text-[12.5px] font-semibold text-gray-500 hover:text-indigo-700 transition-colors">
                        View all
                    </Link>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <Loader2 size={24} className="text-[#4F46E5] animate-spin mb-2" />
                        <p className="text-gray-500 text-sm italic">Fetching recent jobs...</p>
                    </div>
                ) : error ? (
                    <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                ) : formattedJobs.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-gray-500 text-sm">No jobs posted recently.</p>
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
