"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Briefcase,
    LayoutDashboard,
    PlusCircle,
    LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/store/authSlice";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ConfirmationModal from "./ConfirmationModal";

export const sidebarLinks = [
    { name: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
    { name: "Post a Job", href: "/dashboard/post-jobs", icon: PlusCircle },
    { name: "My Jobs", href: "/dashboard/my-jobs", icon: Briefcase },
];

export default function Sidebar() {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

    const sidebarRef = React.useRef<HTMLElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(sidebarRef.current, {
            x: -260,
            opacity: 0,
            duration: 0.8,
            clearProps: "all"
        })
            .from(".sidebar-link", {
                x: -20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                clearProps: "all"
            }, "-=0.4");
    }, { scope: sidebarRef });

    const handleLogout = () => {
        dispatch(logout());
        router.push("/");
        setIsLogoutModalOpen(false);
    };

    return (
        <>
            <aside ref={sidebarRef} className="fixed left-0 top-[76px] h-[calc(100vh-76px)] w-[260px] bg-white border-r border-[#E5E5E6] hidden md:flex flex-col z-50">
                <div className="flex-1 px-4 py-6 overflow-y-auto">
                    <h3 className="text-[13px] font-medium text-[#7E7E86] uppercase mb-4">
                        Employers Dashboard
                    </h3>
                    <nav className="space-y-1">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`sidebar-link flex items-center gap-3 px-4 py-2.5 transition-all duration-200 group relative border-l-3 ${isActive
                                        ? "bg-[#E5E6FB] text-[#4F46E5] border-[#4F46E5]"
                                        : "text-gray-500 hover:text-[#4F46E5] hover:bg-gray-50 border-transparent"
                                        }`}
                                >
                                    <motion.div
                                        className="flex items-center gap-3 w-full"
                                        whileHover={{ x: 4 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <Icon size={18} className={`${isActive ? "text-[#4F46E5]" : "text-gray-400 group-hover:text-[#4F46E5]"}`} />
                                        <span className="font-medium text-[14px]">{link.name}</span>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout - Deskopt Only */}
                <div className="p-4 border-t border-gray-50">
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-[#7E7E86] hover:text-red-500 hover:bg-red-50 transition-all duration-200 group"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-[14px]">Log Out</span>
                    </button>
                </div>
            </aside>

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
