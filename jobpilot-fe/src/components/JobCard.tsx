"use client";

import React from "react";
import {
    CheckCircle2,
    AlertCircle,
    Users,
    MoreVertical,
    Pencil,
    Trash2,
    CircleDashed,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Job } from "@/types/job";

interface JobCardProps {
    job: Job;
    onDelete: (job: Job) => void;
}

export default function JobCard({ job, onDelete }: JobCardProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const getStatusIcon = () => {
        if (job.status === "Active") return <CheckCircle2 size={14} className="text-green-500" />;
        if (job.status === "Draft") return <CircleDashed size={14} className="text-gray-400" />;
        return <AlertCircle size={14} className="text-red-400" />;
    };

    const getStatusColor = () => {
        if (job.status === "Active") return "text-green-500 bg-green-50";
        if (job.status === "Draft") return "text-gray-500 bg-gray-50";
        return "text-red-500 bg-red-50";
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
            {/* Header: Title and Menu */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 text-[15px]">{job.title}</h3>
                    <div className="flex items-center gap-2 text-[12px]">
                        <span className="text-gray-500">{job.type}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className={job.remaining === "Expired" ? "text-red-500 font-medium" : "text-gray-500"}>
                            {job.remaining}
                        </span>
                    </div>
                </div>

                <div className="relative" ref={menuRef}>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors"
                    >
                        <MoreVertical size={18} />
                    </motion.button>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="absolute right-0 top-9 z-50 w-[160px] bg-white border border-gray-100 rounded-xl shadow-lg py-1.5"
                            >
                                <button
                                    onClick={() => {
                                        router.push(`/dashboard/edit-job/${job.id}`);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 font-medium text-left"
                                >
                                    <Pencil size={14} className="text-gray-400" />
                                    Edit Job
                                </button>
                                <div className="mx-3 my-1 h-px bg-gray-100" />
                                <button
                                    onClick={() => {
                                        onDelete(job);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 font-medium text-left"
                                >
                                    <Trash2 size={14} className="text-red-400" />
                                    Delete Job
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Stats: Status and Applicants */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${getStatusColor()}`}>
                    {getStatusIcon()}
                    <span className="text-[12px] font-medium">{job.status}</span>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500">
                    <Users size={14} className="text-gray-400" />
                    <span className="text-[13px] font-medium">{job.applicants} Applicants</span>
                </div>
            </div>

            {/* Primary Action */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/dashboard/my-jobs/${job.id}`)}
                className="w-full py-2.5 rounded-xl bg-indigo-50 text-[#4F46E5] text-[13px] font-semibold hover:bg-indigo-100 transition-colors"
            >
                View Job Details
            </motion.button>
        </div>
    );
}
