import React from "react";
import { CheckCircle2, X } from "lucide-react";

interface SuccessPopupProps {
    message: string;
    onClose: () => void;
}

import { motion } from "framer-motion";

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed top-6 left-1/2 z-[100]"
        >
            <div className="bg-white border border-green-100 shadow-xl rounded-xl px-4 py-3 flex items-center gap-3.5 min-w-[280px]">
                <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-green-500" size={20} />
                </div>
                <div className="flex-1">
                    <h3 className="text-[14px] font-bold text-gray-900 leading-tight">Success</h3>
                    <p className="text-[12.5px] text-gray-500 mt-0.5 font-medium">{message}</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-1 hover:bg-gray-50 rounded-lg transition-colors text-gray-400"
                >
                    <X size={16} />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default SuccessPopup;
