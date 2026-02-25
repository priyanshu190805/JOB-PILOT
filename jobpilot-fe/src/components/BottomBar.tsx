"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "./Sidebar";

export default function BottomBar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 h-[64px] flex items-center justify-around px-2 z-50 md:hidden">
            {sidebarLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                const Icon = link.icon;

                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-200 ${isActive ? "text-[#4F46E5]" : "text-gray-400"
                            }`}
                    >
                        <Icon size={20} className={isActive ? "text-[#4F46E5]" : "text-gray-400"} />
                        <span className={`text-[10px] font-medium ${isActive ? "text-[#4F46E5]" : "text-gray-400"}`}>
                            {link.name}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
