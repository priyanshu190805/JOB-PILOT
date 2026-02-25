"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Job",
    message = "Are you sure you want to delete this job?"
}: DeleteModalProps) {

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-20 sm:pt-10">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/20"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-[440px] bg-white rounded-[24px] shadow-2xl p-8 space-y-4"
                    >
                        <div className="space-y-2">
                            <h2 className="text-[20px] font-semibold text-gray-800">{title}</h2>
                            <p className="text-[15px] text-gray-400">{message}</p>
                        </div>

                        <div className="h-[1px] w-full bg-gray-100" />

                        <div className="flex items-center justify-end gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="h-[52px] px-8 rounded-[26px] border border-gray-100 text-[15px] font-semibold text-gray-600 hover:bg-gray-50 transition-all flex-1 sm:flex-none"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onConfirm}
                                className="h-[48px] px-8 rounded-[26px] bg-[#F04438] text-white text-[15px] font-semibold hover:bg-[#D92D20] transition-all flex-1 sm:flex-none shadow-sm shadow-red-200"
                            >
                                Delete
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
