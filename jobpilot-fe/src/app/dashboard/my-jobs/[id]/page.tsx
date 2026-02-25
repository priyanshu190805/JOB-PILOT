"use client";

import React, { useEffect } from "react";
import {
    Briefcase, MapPin, Trash2, Pencil, Calendar, Clock, GraduationCap, Loader2,
    CloudCog, Users
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getJobById, deleteJob } from "@/store/jobSlice";
import DeleteModal from "@/components/ConfirmationModal";

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const id = params.id as string;

    const { token } = useSelector((state: RootState) => state.auth);
    const { currentJob, loading, error } = useSelector((state: RootState) => state.jobs);

    console.log(currentJob);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

    useEffect(() => {
        if (token && id) {
            dispatch(getJobById({ id, token }));
        }
    }, [dispatch, token, id]);

    const handleDelete = async () => {
        setIsDeleteModalOpen(false);
        if (id && token) {
            await dispatch(deleteJob({ id, token }));
            router.push("/dashboard/my-jobs");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 size={40} className="text-[#4F46E5] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading job details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-[1200px] mx-auto p-12 bg-red-50 border border-red-100 rounded-3xl text-center">
                <p className="text-red-600 font-medium text-lg mb-6">{error}</p>
                <button
                    onClick={() => token && id && dispatch(getJobById({ id, token }))}
                    className="px-8 py-3 bg-white border border-red-200 text-red-600 rounded-3xl hover:bg-red-50 transition-all font-semibold shadow-sm"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!currentJob) return null;

    return (
        <div className="w-full px-4 md:px-0 max-w-[1200px] mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-[24px] font-medium text-[#434348]">Job Details</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="p-2.5 rounded-xl text-red-400 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={22} />
                    </button>
                    <Link
                        href={`/dashboard/edit-job/${id}`}
                        className="h-[42px] px-8 rounded-3xl bg-[#5148E5] text-white text-sm hover:bg-[#4338CA] transition-all flex items-center gap-2"
                    >
                        Edit Job
                    </Link>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Job"
                message={`Are you sure you want to delete "${currentJob.jobTitle}"?`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Content */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="space-y-5">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-[24px] font-medium text-[#434348] leading-tight">
                                {currentJob.jobTitle}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-[12px] font-semibold border ${currentJob.status === "Active" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                                {currentJob.status}
                            </span>
                        </div>

                        {currentJob.tags && currentJob.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {currentJob.tags.map((tag: string, index: number) => (
                                    <span key={index} className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[13px] font-medium border border-gray-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="space-y-2">
                            <h3 className="text-[1.1rem] font-medium text-gray-900">Description</h3>
                            <div
                                className="text-[14px] leading-relaxed text-gray-600 whitespace-pre-wrap break-words"
                                dangerouslySetInnerHTML={{ __html: currentJob.description }}
                            />
                        </div>

                        {currentJob.requirements && (
                            <div className="space-y-2">
                                <h3 className="text-[1.1rem] font-medium text-gray-900">Requirements</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {currentJob.requirements.split('\n').filter((req: string) => req.trim() !== "").map((req: string, index: number) => (
                                        <li key={index} className="text-[15px] text-gray-600 leading-normal break-words">
                                            {req.trim()}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-sm">
                        <div className="text-center flex-1 border-b sm:border-b-0 sm:border-r border-gray-100 pb-4 sm:pb-0 sm:pr-4">
                            <p className="text-[14px] font-medium text-[#7E7E86]">Salary ({currentJob.currency || "USD"})</p>
                            <h3 className="text-[18px] font-medium text-green-500 mt-1">
                                {currentJob.minSalary?.toLocaleString()} - {currentJob.maxSalary?.toLocaleString()}
                            </h3>
                            <p className="text-[12px] text-[#7E7E86] mt-0.5">{currentJob.salaryType} salary</p>
                        </div>
                        <div className="flex-1 pl-0 sm:pl-4 pt-4 sm:pt-0 flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-1">
                                <MapPin size={20} className="text-indigo-500" />
                            </div>
                            <p className="text-[12px] font-medium text-[#7E7E86]">Job Location</p>
                            <p className="text-[14px] font-semibold text-[#434348]">
                                {(currentJob as any).state}, {currentJob.country}
                                {currentJob.isRemote && <span className="block text-[11px] text-indigo-500 font-medium">(Remote)</span>}
                            </p>
                        </div>
                    </div>

                    {/* Job Overview Card */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
                        <h3 className="text-[1.2rem] font-medium text-[#434348]">Job Overview</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
                            <div className="flex flex-col gap-1.5 items-start">
                                <Calendar size={20} className="text-[#4F46E5]" />
                                <p className="text-[12px] text-[#7E7E86]">Job Posted</p>
                                <p className="text-[14px] font-semibold text-[#434348]">
                                    {new Date(currentJob.createdAt).toLocaleDateString('en-GB', {
                                        day: '2-digit', month: 'short', year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1.5 items-start">
                                <Clock size={20} className="text-[#4F46E5]" />
                                <p className="text-[12px] font-medium text-gray-400">Job Expires on</p>
                                <p className="text-[14px] font-semibold text-gray-700">
                                    {new Date(currentJob.expirationDate).toLocaleDateString('en-GB', {
                                        day: '2-digit', month: 'short', year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1.5 items-start">
                                <Briefcase size={20} className="text-[#4F46E5]" />
                                <p className="text-[12px] font-medium text-gray-400">Job Level</p>
                                <p className="text-[14px] font-semibold text-gray-700">{currentJob.jobLevel}</p>
                            </div>
                            <div className="flex flex-col gap-1.5 items-start">
                                <CloudCog size={20} className="text-[#4F46E5]" />
                                <p className="text-[12px] font-medium text-gray-400">Experience</p>
                                <p className="text-[14px] font-semibold text-gray-700">{currentJob.experienceLevel}</p>
                            </div>
                            <div className="flex flex-col gap-1.5 items-start">
                                <GraduationCap size={20} className="text-[#4F46E5]" />
                                <p className="text-[12px] font-medium text-gray-400">Education</p>
                                <p className="text-[14px] font-semibold text-gray-700">{currentJob.educationLevel}</p>
                            </div>
                            <div className="flex flex-col gap-1.5 items-start">
                                <Pencil size={20} className="text-[#4F46E5]" />
                                <p className="text-[12px] font-medium text-gray-400">Job Role</p>
                                <p className="text-[14px] font-semibold text-gray-700">{currentJob.jobRole}</p>
                            </div>
                            <div className="flex flex-col gap-1.5 items-start">
                                <Briefcase size={20} className="text-[#4F46E5]" />
                                <p className="text-[12px] font-medium text-gray-400">Job Type</p>
                                <p className="text-[14px] font-semibold text-gray-700">{currentJob.jobType}</p>
                            </div>
                            <div className="flex flex-col gap-1.5 items-start">
                                <Users size={20} className="text-[#4F46E5]" />
                                <p className="text-[12px] font-medium text-gray-400">Applicants</p>
                                <p className="text-[14px] font-semibold text-gray-700">{currentJob.applicants || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
