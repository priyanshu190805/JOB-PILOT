"use client";

import React, { useMemo, useState, useRef } from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ConfirmationModal from "./ConfirmationModal";

export default function Navbar() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { company } = useSelector((state: RootState) => state.company);
    const dispatch = useDispatch();
    const router = useRouter();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const headerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(headerRef.current, {
            y: -74,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "all"
        });
    }, { scope: headerRef });

    const userInitial = useMemo(() => {
        if (!user?.name) return null;
        return user.name.charAt(0).toUpperCase();
    }, [user?.name]);

    const handleLogout = () => {
        dispatch(logout());
        router.push("/");
        setIsLogoutModalOpen(false);
        setIsProfileOpen(false);
    };

    return (
        <header ref={headerRef} className="h-[74px] bg-white border-b border-gray-100 flex items-center justify-between px-8 fixed top-0 left-0 w-full z-50">
            {/* Brand Logo */}
            <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 shrink-0">
                    <circle cx="18" cy="18" r="18" fill="#0066FF" opacity="0.12" />
                    <path d="M18 6C11.373 6 6 11.373 6 18s5.373 12 12 12 12-5.373 12-12S24.627 6 18 6zm0 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9z" fill="#0066FF" opacity="0.3" />
                    <path d="M23 14l-7 4-7-4" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="18" cy="18" r="3" fill="#0066FF" />
                    <path d="M11 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-[1.35rem] font-semibold text-gray-900 tracking-tight">JobPilot</span>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
                {/* Post a Job Button (Desktop Only) */}
                <Link href="/dashboard/post-jobs" className="hidden md:block">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-[40px] px-8 rounded-3xl border border-[#4F46E5] text-[#4F46E5] text-sm font-semibold hover:bg-[#F0F1FF] transition-all active:scale-[0.98]"
                    >
                        Post a Job
                    </motion.button>
                </Link>

                <div className="flex items-center gap-4 border-l-0 md:border-l border-gray-100 pl-0 md:pl-4 relative">
                    {/* User Profile Avatar / Mobile Logout Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            if (window.innerWidth < 768) {
                                setIsProfileOpen(!isProfileOpen);
                            }
                        }}
                        className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-base font-semibold shadow-sm overflow-hidden md:cursor-default transition-all outline-none border border-indigo-100"
                    >
                        {company?.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={company.logo} alt="Company Logo" className="w-full h-full object-cover" />
                        ) : (
                            userInitial || <User size={20} />
                        )}
                    </motion.button>

                    {/* Mobile Dropdown Menu (Logout only on Mobile toggle) */}
                    {isProfileOpen && (
                        <div className="absolute top-14 right-0 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 mt-2 z-[60] md:hidden animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                <p className="text-[13px] font-semibold text-gray-800 truncate">{user?.name}</p>
                                <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsLogoutModalOpen(true);
                                    setIsProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
                            >
                                <LogOut size={16} />
                                <span>Log Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="Log Out"
                message="Are you sure you want to log out of your account?"
                confirmText="Log Out"
                confirmColor="bg-red-600 hover:bg-red-700 shadow-red-200"
            />
        </header>
    );
}
