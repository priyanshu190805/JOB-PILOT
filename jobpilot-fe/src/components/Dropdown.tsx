"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface DropdownProps {
    id?: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
    placeholder?: string;
    error?: string;
    searchable?: boolean;
}

export default function Dropdown({ id, value, onChange, options, placeholder = "Select…", error, searchable = false }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (open && searchable) {
            setSearchTerm("");
            setTimeout(() => searchInputRef.current?.focus(), 10);
        }
    }, [open, searchable]);

    const filteredOptions = searchable
        ? options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()))
        : options;

    return (
        <div ref={ref} className="relative w-full" id={id}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`w-full h-[46px] px-4 pr-10 rounded-xl border bg-white text-sm text-left flex items-center transition-all outline-none
                    ${open
                        ? "border-indigo-500 ring-2 ring-indigo-100"
                        : error
                            ? "border-red-400 focus:border-red-400"
                            : "border-gray-200 hover:border-indigo-300"
                    }
                    ${value ? "text-gray-900" : "text-gray-400"}`}
            >
                <span className="flex-1 truncate">{value || placeholder}</span>
                <ChevronDown
                    size={16}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {/* Options panel */}
            {open && (
                <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden flex flex-col">
                    {searchable && (
                        <div className="p-2 border-b border-gray-50 bg-gray-50/50">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-9 px-3 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-indigo-400 transition-all placeholder:text-gray-400"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}
                    <ul className="py-1 max-h-52 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(opt => (
                                <li key={opt}>
                                    <button
                                        type="button"
                                        onClick={() => { onChange(opt); setOpen(false); }}
                                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors
                                            ${opt === value
                                                ? "bg-indigo-50 text-indigo-600 font-medium"
                                                : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="flex-1">{opt}</span>
                                        {opt === value && <Check size={14} className="text-indigo-500 shrink-0" />}
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-6 text-center text-sm text-gray-400">
                                No results found
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
