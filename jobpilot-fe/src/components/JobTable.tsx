"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    AlertCircle,
    Users,
    MoreVertical,
    Eye,
    Pencil,
    Trash2,
    CircleDashed,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Job } from "@/types/job";

interface JobTableProps {
    jobs: Job[];
    onDelete: (job: Job) => void;
}


export default function JobTable({ jobs, onDelete }: JobTableProps) {
    const router = useRouter();
    const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="bg-white rounded-lg">
            <div>
                <table className="w-full min-w-[680px] text-left border-collapse">
                    {/* ── Header ── */}
                    <thead>
                        <tr className="bg-[#F2F2F3] border-b border-gray-100">
                            <th className="px-6 py-3 text-[14px] font-medium text-[#7E7E86] tracking-wider rounded-l-lg w-[40%]">Jobs</th>
                            <th className="px-6 py-3 text-[14px] font-medium text-[#7E7E86] tracking-wider w-[18%]">Status</th>
                            <th className="px-6 py-3 text-[14px] font-medium text-[#7E7E86] tracking-wider w-[22%]">Applications</th>
                            <th className="px-6 py-3 text-[14px] font-medium text-[#7E7E86] tracking-wider text-right pr-30 rounded-r-lg w-[20%]">Actions</th>
                        </tr>
                    </thead>

                    {/* ── Rows ── */}
                    <tbody className="divide-y divide-gray-50">
                        {jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50/60 transition-colors">

                                {/* Job title + meta */}
                                <td className="px-4 py-5">
                                    <p className="font-medium text-gray-800 text-[14px] leading-tight">{job.title}</p>
                                    <p className={`text-[12px] mt-1 flex items-center gap-2.5 ${job.remaining === "Expired" ? "text-red-500 font-medium" : "text-gray-400"}`}>
                                        {job.type}
                                        <span className="w-[3px] h-[3px] rounded-full bg-gray-300 inline-block" />
                                        {job.remaining}
                                    </p>
                                </td>

                                {/* Status badge */}
                                <td className="px-6 py-5">
                                    {job.status === "Active" ? (
                                        <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-green-500">
                                            <CheckCircle2 size={18} className="text-green-500" /> Active
                                        </span>
                                    ) : job.status === "Draft" ? (
                                        <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-gray-500">
                                            <CircleDashed size={18} className="text-gray-400" /> Draft
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-red-500">
                                            <AlertCircle size={18} className="text-red-400" /> Expired
                                        </span>
                                    )}
                                </td>

                                {/* Applications count */}
                                <td className="px-6 py-5">
                                    <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#434348]">
                                        <Users size={18} className="text-[#434348]" />
                                        {job.applicants} Applications
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-end gap-3">

                                        {/* Primary: View Job */}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => router.push(`/dashboard/my-jobs/${job.id}`)}
                                            className="h-[38px] px-6 rounded-3xl bg-[#E5E6FB] text-[#4F46E5] font-medium text-[14px] hover:bg-[#E0E1FD] transition-colors"
                                        >
                                            View Job
                                        </motion.button>

                                        {/* Secondary: ⋮ dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setOpenMenuId(openMenuId === job.id ? null : job.id)
                                                }
                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#434348] hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                            >
                                                <MoreVertical size={19} />
                                            </button>

                                            <AnimatePresence>
                                                {openMenuId === job.id && (
                                                    <motion.div
                                                        ref={menuRef}
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                                        className="absolute right-0 top-9 z-50 w-[162px] bg-white border border-gray-100 rounded-xl shadow-lg py-1.5"
                                                    >

                                                        {/* Edit Job */}
                                                        <button
                                                            onClick={() => {
                                                                router.push(`/dashboard/edit-job/${job.id}`);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 font-medium text-left transition-colors"
                                                        >
                                                            <Pencil size={14} className="text-gray-400" />
                                                            Edit Job
                                                        </button>

                                                        {/* Divider */}
                                                        <div className="mx-3 my-1 h-px bg-gray-100" />

                                                        {/* Delete Job */}
                                                        <button
                                                            onClick={() => {
                                                                onDelete(job);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 font-medium text-left transition-colors"
                                                        >
                                                            <Trash2 size={14} className="text-red-400" />
                                                            Delete Job
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
