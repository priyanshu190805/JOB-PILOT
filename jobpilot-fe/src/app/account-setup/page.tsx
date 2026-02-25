"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Dropdown from "@/components/Dropdown";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setupCompany, clearCompanyError } from "@/store/companySlice";
import { OrgType, IndustryType, TeamSize } from "@/types/enums";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

const inputCls =
    "w-full h-[46px] px-4 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all";

export default function AccountSetupPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { loading, error: apiError, setupSuccess } = useSelector((state: RootState) => state.company);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = (file: File | undefined) => {
        if (!file) return;
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const [companyName, setCompanyName] = useState("");
    const [orgType, setOrgType] = useState("");
    const [industryType, setIndustryType] = useState("");
    const [teamSize, setTeamSize] = useState("");
    const [yearEstablished, setYearEstablished] = useState("");
    const [aboutUs, setAboutUs] = useState("");

    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        return () => {
            dispatch(clearCompanyError());
        };
    }, [dispatch]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!companyName) newErrors.companyName = "Company name is required";
        else if (companyName.length < 5) newErrors.companyName = "Must be at least 5 characters";

        if (!orgType) newErrors.orgType = "Organization type is required";
        if (!industryType) newErrors.industryType = "Industry type is required";
        if (!teamSize) newErrors.teamSize = "Team size is required";
        if (!yearEstablished) newErrors.yearEstablished = "Year established is required";
        else if (yearEstablished.length !== 4) newErrors.yearEstablished = "Must be exactly 4 digits";

        if (!aboutUs) newErrors.aboutUs = "About us description is required";
        else if (aboutUs.length < 10) newErrors.aboutUs = "Must be at least 10 characters";

        if (!location) newErrors.location = "Location is required";
        else if (location.length < 5) newErrors.location = "Must be at least 5 characters";

        if (!phone || phone.length < 10) newErrors.phone = "Valid contact number is required";

        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address";
        else if (email.length < 5) newErrors.email = "Must be at least 5 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearCompanyError());

        if (validateForm()) {
            if (!user?.id) {
                alert("User session not found. Please log in again.");
                return;
            }

            const formData = new FormData();
            formData.append("companyName", companyName);
            formData.append("orgType", orgType);
            formData.append("industryType", industryType);
            formData.append("teamSize", teamSize);
            formData.append("yearEstablished", yearEstablished);
            formData.append("aboutUs", aboutUs);
            formData.append("location", location);
            formData.append("phone", phone);
            formData.append("email", email);

            if (logoFile) {
                formData.append("logo", logoFile);
            }

            dispatch(setupCompany(formData));
        }
    };

    const Logo = () => (
        <div className="flex items-end gap-1 mb-9">
            <Image
                src="/image/Vector.png"
                alt="JobPilot Logo"
                width={28}
                height={28}
                className="shrink-0"
            />
            <span className="text-[1.5rem] font-medium text-[#434348] tracking-tight leading-none">JobPilot</span>
        </div>
    );

    const successContainerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!setupSuccess) return;

        const tl = gsap.timeline({
            defaults: {
                ease: "power4.out",
                clearProps: "all"
            }
        });

        tl.from(".success-logo", {
            y: -30,
            opacity: 0,
            duration: 0.6
        })
            .from(".success-check", {
                scale: 0,
                opacity: 0,
                duration: 0.7,
                ease: "back.out(1.7)"
            }, "-=0.3")
            .from(".success-title", {
                y: 15,
                opacity: 0,
                duration: 0.5
            }, "-=0.4")
            .from(".success-btn", {
                y: 15,
                opacity: 0,
                duration: 0.5
            }, "-=0.3");
    }, { scope: successContainerRef, dependencies: [setupSuccess] });

    if (setupSuccess) {
        return (
            <div ref={successContainerRef} className="h-screen w-screen bg-white relative flex items-center justify-center overflow-hidden">
                <div className="success-logo absolute top-10 left-8 sm:left-24 lg:left-36">
                    <Logo />
                </div>

                <div className="flex flex-col items-center">
                    <motion.div
                        className="success-check w-[72px] h-[72px] rounded-full bg-indigo-100 flex items-center justify-center mb-6"
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </motion.div>

                    <h2 className="success-title text-lg sm:text-[24px] font-medium text-[#434348] text-center px-6">
                        🎉 Congratulations, Your profile is 100% complete!
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => router.push("/dashboard/overview")}
                            className="success-btn h-[44px] text-[#5D5FEF] bg-[#E5E6FB] px-10 rounded-[36px] text-[16px] font-medium hover:bg-indigo-50 transition-colors"
                        >
                            View Dashboard
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => router.push("/dashboard/post-jobs")}
                            className="success-btn h-[44px] px-16 rounded-[36px] bg-[#5D5FEF] text-white text-[16px] font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm"
                        >
                            Post a Job
                        </motion.button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="px-8 sm:px-24 lg:px-36 py-8">

                <Logo />
                <h1 className="text-[30px] font-medium text-[#434348] mb-7">Account Setup</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>

                    {apiError && (
                        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {apiError}
                        </div>
                    )}

                    <section>
                        <h2 className="text-[18px] font-medium text-[#434348] mb-3">Logo Upload</h2>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            className={`w-full max-w-[350px] h-[170px] rounded-[12px] border-2 border-transparent flex flex-col items-center justify-center cursor-pointer transition-all
                                ${isDragging ? "bg-blue-50" : "hover:bg-gray-50 bg-white"}`}
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='${isDragging ? "%230066FF" : "%23E4E4E7"}' stroke-width='2' stroke-dasharray='10%2c 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
                                borderRadius: "12px"
                            }}
                        >
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain rounded-xl p-4" />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="mb-4">
                                        <UploadCloud size={40} className="text-[#C5C5C9] stroke-[1]" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[0.82rem] text-gray-400 mb-1">
                                            <span className="font-semibold text-gray-700">Browse photo</span> or drop here
                                        </p>
                                        <p className="text-[0.82rem] text-gray-400">
                                            A photo larger than 400 pixels work best.
                                        </p>
                                        <p className="text-[0.82rem] text-gray-400">
                                            Max file size 5 MB.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                            onChange={(e) => handleFile(e.target.files?.[0])} />
                    </section>

                    <section>
                        <h2 className="text-[18px] font-medium text-[#434348] mb-3">Company Info</h2>
                        <div className="flex flex-col gap-4">

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-[#7E7E86]" htmlFor="companyName">Company Name</label>
                                    <input
                                        id="companyName"
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => {
                                            setCompanyName(e.target.value);
                                            if (errors.companyName) setErrors({ ...errors, companyName: "" });
                                        }}
                                        className={`${inputCls} ${errors.companyName ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
                                    />
                                    {errors.companyName && <p className="text-xs text-red-500 mt-0.5">{errors.companyName}</p>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-[#7E7E86]">Organization Type</label>
                                    <Dropdown
                                        value={orgType} onChange={(val) => {
                                            setOrgType(val);
                                            if (errors.orgType) setErrors({ ...errors, orgType: "" });
                                        }}
                                        options={Object.values(OrgType)}
                                        placeholder="Select type"
                                        error={errors.orgType}
                                    />
                                    {errors.orgType && <p className="text-xs text-red-500 mt-0.5">{errors.orgType}</p>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-[#7E7E86]">Industry Type</label>
                                    <Dropdown
                                        value={industryType} onChange={(val) => {
                                            setIndustryType(val);
                                            if (errors.industryType) setErrors({ ...errors, industryType: "" });
                                        }}
                                        options={Object.values(IndustryType)}
                                        placeholder="Select industry"
                                        error={errors.industryType}
                                    />
                                    {errors.industryType && <p className="text-xs text-red-500 mt-0.5">{errors.industryType}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-[#7E7E86]">Team Size</label>
                                    <Dropdown
                                        value={teamSize} onChange={(val) => {
                                            setTeamSize(val);
                                            if (errors.teamSize) setErrors({ ...errors, teamSize: "" });
                                        }}
                                        options={Object.values(TeamSize)}
                                        placeholder="Select size"
                                        error={errors.teamSize}
                                    />
                                    {errors.teamSize && <p className="text-xs text-red-500 mt-0.5">{errors.teamSize}</p>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-[#7E7E86]" htmlFor="yearEstablished">Year of Establishment</label>
                                    <input id="yearEstablished" type="text" inputMode="numeric" placeholder="e.g. 2010"
                                        value={yearEstablished}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === "" || /^\d+$/.test(val)) {
                                                if (val.length <= 4) {
                                                    setYearEstablished(val);
                                                    if (errors.yearEstablished) setErrors({ ...errors, yearEstablished: "" });
                                                }
                                            }
                                        }}
                                        className={`${inputCls} ${errors.yearEstablished ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`} />
                                    {errors.yearEstablished && <p className="text-xs text-red-500 mt-0.5">{errors.yearEstablished}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-[#7E7E86]" htmlFor="aboutUs">About Us</label>
                                <textarea
                                    id="aboutUs"
                                    rows={3}
                                    value={aboutUs}
                                    onChange={(e) => {
                                        setAboutUs(e.target.value);
                                        if (errors.aboutUs) setErrors({ ...errors, aboutUs: "" });
                                    }}
                                    className={`w-full px-4 py-2.5 rounded-xl border bg-white text-gray-900 text-sm outline-none transition-all resize-none ${errors.aboutUs ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                                />
                                {errors.aboutUs && <p className="text-xs text-red-500 mt-0.5">{errors.aboutUs}</p>}
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[18px] font-medium text-[#434348] mb-3">Contact Info</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-[#7E7E86]" htmlFor="location">Location</label>
                                <input
                                    id="location"
                                    type="text"
                                    value={location}
                                    onChange={(e) => {
                                        setLocation(e.target.value);
                                        if (errors.location) setErrors({ ...errors, location: "" });
                                    }}
                                    className={`${inputCls} ${errors.location ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
                                />
                                {errors.location && <p className="text-xs text-red-500 mt-0.5">{errors.location}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-[#7E7E86]">Contact Number</label>
                                <PhoneInput
                                    country={"us"} value={phone} onChange={(val) => {
                                        setPhone(val);
                                        if (errors.phone) setErrors({ ...errors, phone: "" });
                                    }}
                                    inputStyle={{ width: "100%", height: "46px", borderRadius: "12px", border: errors.phone ? "1px solid #f87171" : "1px solid #e5e7eb", fontSize: "14px", paddingLeft: "52px" }}
                                    buttonStyle={{ borderRadius: "12px 0 0 12px", border: errors.phone ? "1px solid #f87171" : "1px solid #e5e7eb", borderRight: "none", background: "white" }}
                                    containerStyle={{ width: "100%" }}
                                    enableSearch searchPlaceholder="Search country..."
                                />
                                {errors.phone && <p className="text-xs text-red-500 mt-0.5">{errors.phone}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-[#7E7E86]" htmlFor="setupEmail">Email Address</label>
                                <input
                                    id="setupEmail"
                                    type="text"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors({ ...errors, email: "" });
                                    }}
                                    className={`${inputCls} ${errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                            </div>
                        </div>
                    </section>

                    <div className="flex pt-2">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={loading}
                            className={`h-[46px] px-14 rounded-[32px] bg-[#5D5FEF] text-white text-[15px] hover:bg-indigo-700 transition-all shadow-sm ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Saving..." : "Finish Setup"}
                        </motion.button>
                    </div>

                </form>
            </div>
        </div>
    );
}
