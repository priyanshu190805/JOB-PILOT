"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    confirmColor?: string;
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Job",
    message = "Are you sure you want to delete this job?",
    confirmText = "Delete",
    confirmColor = "bg-[#F04438] hover:bg-[#D92D20] shadow-red-200"
}: DeleteModalProps) {

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
                <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 sm:p-6 pt-20 sm:pt-10">
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
                        className="relative w-full max-w-[380px] bg-white rounded-[20px] p-6 space-y-2"
                    >
                        <div className="space-y-1">
                            <h2 className="text-[18px] font-medium text-[#434348]">{title}</h2>
                            <p className="text-[12px] text-[#7E7E86] font-medium">{message}</p>
                        </div>

                        <div className="h-[2px] w-full bg-gray-100" />

                        <div className="flex items-center justify-end gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="h-[44px] px-6 rounded-[22px] border-2 border-gray-100 text-[14px] font-medium text-[#434348] hover:bg-gray-50 transition-all flex-1 sm:flex-none"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onConfirm}
                                className={`h-[42px] px-8 rounded-[22px] text-white text-[14px] transition-all flex-1 sm:flex-none shadow-sm ${confirmColor}`}
                            >
                                {confirmText}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
