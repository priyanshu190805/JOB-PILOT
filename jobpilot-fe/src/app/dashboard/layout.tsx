"use client";

import React, { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import BottomBar from "@/components/BottomBar";
import SuccessPopup from "@/components/SuccessPopup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { clearJobStatus } from "@/store/jobSlice";
import { getCompany } from "@/store/companySlice";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useDispatch<AppDispatch>();
    const pathname = usePathname();
    const { success } = useSelector((state: RootState) => state.jobs);
    const { company } = useSelector((state: RootState) => state.company);

    useEffect(() => {
        if (!company) {
            dispatch(getCompany());
        }
    }, [dispatch, company]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                dispatch(clearJobStatus());
            }, 4000); // Show for 4 seconds
            return () => clearTimeout(timer);
        }
    }, [success, dispatch]);

    return (
        <div className="min-h-screen bg-white flex flex-col pt-[74px]">
            <AnimatePresence>
                {success && (
                    <SuccessPopup
                        message="Job posted successfully! It's now live on the platform."
                        onClose={() => dispatch(clearJobStatus())}
                    />
                )}
            </AnimatePresence>
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 ml-0 md:ml-[260px] p-4 sm:p-8 overflow-y-auto flex flex-col pb-[80px] md:pb-8 relative">
                    {children}
                </main>
            </div>
            <BottomBar />
        </div>
    );
}
