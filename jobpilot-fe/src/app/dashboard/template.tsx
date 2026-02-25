"use client";

import { motion } from "framer-motion";

export default function DashboardTemplate({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for a premium feel
            }}
            className="flex-1 flex flex-col h-full w-full"
        >
            {children}
        </motion.div>
    );
}
