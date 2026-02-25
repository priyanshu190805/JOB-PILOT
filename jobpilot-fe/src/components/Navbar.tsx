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
import Image from "next/image";

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
        <>
            <header ref={headerRef} className="h-[76px] bg-white border-b border-[#E5E5E6] flex items-center justify-between px-8 fixed top-0 left-0 w-full z-[60]">
                {/* Brand Logo */}
                <div className="flex items-end gap-1.5">
                    <Image
                        src="/image/Vector.png"
                        alt="JobPilot Logo"
                        width={28}
                        height={28}
                        className="shrink-0"
                    />
                    <span className="text-[1.5rem] font-medium text-[#434348] tracking-tight leading-none">JobPilot</span>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2">
                    {/* Post a Job Button (Desktop Only) */}
                    <Link href="/dashboard/post-jobs" className="hidden md:block">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="h-[40px] px-7 rounded-4xl border border-[#4F46E5] text-[#5D5FEF] text-[16px] font-medium hover:bg-[#F0F1FF] transition-all active:scale-[0.98]"
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
                            className="w-11 h-11 rounded-full bg-[#EF5DA8] flex items-center justify-center text-white text-base font-semibold shadow-sm overflow-hidden md:cursor-default transition-all outline-none border border-indigo-100"
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

            </header>
            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="Log Out"
                message="Are you sure you want to log out of your account?"
                confirmText="Log Out"
                confirmColor="bg-red-600 hover:bg-red-700 shadow-red-200"
            />
        </>
    );
}
