"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { login, register, clearError } from "@/store/authSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const carouselImages = ["/image/homepage.png", "/image/office.jpg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.from(".logo-anim", {
      y: -20,
      opacity: 0,
      duration: 0.5,
      clearProps: "all"
    })
      .from(".stagger-anim > *", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.04,
        clearProps: "all"
      }, "-=0.4");

    gsap.to(".logo-anim svg", {
      y: -4,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  const [tab, setTab] = useState<"login" | "register">("login");

  useEffect(() => {
    dispatch(clearError());
    setLoginErrors({});
    setRegisterErrors({});
  }, [tab, dispatch]);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [registerErrors, setRegisterErrors] = useState<{
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateLogin = () => {
    const errors: { email?: string; password?: string } = {};
    if (!loginEmail) errors.email = "Username or Email is required";
    else if (loginEmail.length < 5) errors.email = "Must be at least 5 characters";

    if (!loginPassword) errors.password = "Password is required";
    else if (loginPassword.length < 5) errors.password = "Must be at least 5 characters";

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const errors: typeof registerErrors = {};
    if (!fullName) errors.fullName = "Full name is required";
    else if (fullName.length < 5) errors.fullName = "Must be at least 5 characters";

    if (!username) errors.username = "Username is required";
    else if (username.length < 5) errors.username = "Must be at least 5 characters";

    if (!regEmail) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(regEmail)) errors.email = "Invalid email address";

    if (!regPassword) errors.password = "Password is required";
    else if (regPassword.length < 6) errors.password = "Must be at least 6 characters";

    if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (regPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match";

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    const isEmail = loginEmail.includes("@");
    const credentials = isEmail
      ? { email: loginEmail, password: loginPassword }
      : { username: loginEmail, password: loginPassword };

    const resultAction = await dispatch(login(credentials));
    if (login.fulfilled.match(resultAction)) {
      router.push("/dashboard/overview");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    const resultAction = await dispatch(register({
      fullName,
      username,
      email: regEmail,
      password: regPassword
    }));
    if (register.fulfilled.match(resultAction)) {
      router.push("/account-setup");
    }
  };

  const formVariants = {
    initial: { opacity: 0, x: 20, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -20, scale: 0.98 },
  };

  return (
    <div ref={containerRef} className="min-h-screen flex overflow-hidden">

      {/* ── Left: Form Panel ── */}
      <div ref={leftPanelRef} className="w-full md:w-1/2 flex flex-col bg-white px-8 sm:px-12 lg:px-16 py-10 overflow-y-auto">

        {/* Logo */}
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

        <div className="flex-1 flex flex-col justify-start pt-23 max-w-[480px] w-full">
          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.div
                key="login-form"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="stagger-anim mb-8">
                  <h1 className="text-[32px] font-medium text-[#434348] leading-tight mb-1.5">Log In to JobPilot</h1>
                  <p className="text-[0.95rem] text-[#434348]">
                    Don't have an account?{" "}
                    <button type="button" onClick={() => setTab("register")}
                      className=" underline underline-offset-2 hover:text-indigo-600 transition-colors">
                      Sign Up
                    </button>
                  </p>
                </div>

                <form onSubmit={handleLogin} className="stagger-anim flex flex-col gap-5" noValidate>
                  {/* Error banner */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-[#7E7E86]" htmlFor="login-email">Username or Email Address</label>
                    <input
                      id="login-email"
                      type="text"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (loginErrors.email) setLoginErrors({ ...loginErrors, email: "" });
                      }}
                      className={`w-full h-[46px] px-4 rounded-xl border bg-white text-gray-900 text-sm outline-none transition-all ${loginErrors.email ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`} />
                    {loginErrors.email && <p className="text-xs text-red-500 mt-0.5">{loginErrors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-gray-400" htmlFor="login-password">Password</label>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showLoginPw ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (loginErrors.password) setLoginErrors({ ...loginErrors, password: "" });
                        }}
                        className={`w-full h-[46px] px-4 pr-12 rounded-xl border bg-white text-gray-900 text-sm outline-none transition-all ${loginErrors.password ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`} />
                      <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} tabIndex={-1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showLoginPw ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    {loginErrors.password && <p className="text-xs text-red-500 mt-0.5">{loginErrors.password}</p>}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="w-full h-[46px] rounded-full bg-[#5D5FEF] text-white text-sm hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Logging in…" : "Log In"}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-[-80px]"
              >
                <div className="mb-6">
                  <h1 className="text-[32px] font-medium text-[#434348] leading-tight mb-1.5">Welcome to JobPilot</h1>
                  <p className="text-[0.95rem] text-[#434348]">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setTab("login")}
                      className="underline underline-offset-2 hover:text-indigo-600 transition-colors">
                      Log in
                    </button>
                  </p>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-4" noValidate>
                  {/* Error banner */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                  {/* Full Name + Username */}
                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-sm text-[#7E7E86]" htmlFor="reg-fullName">Full Name</label>
                      <input
                        id="reg-fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (registerErrors.fullName) setRegisterErrors({ ...registerErrors, fullName: "" });
                        }}
                        className={`w-full h-[46px] px-4 rounded-xl border bg-white text-gray-900 text-sm outline-none transition-all ${registerErrors.fullName ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`} />
                      {registerErrors.fullName && <p className="text-xs text-red-500 mt-0.5">{registerErrors.fullName}</p>}
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-sm text-[#7E7E86]" htmlFor="reg-username">Username</label>
                      <input
                        id="reg-username"
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (registerErrors.username) setRegisterErrors({ ...registerErrors, username: "" });
                        }}
                        className={`w-full h-[46px] px-4 rounded-xl border bg-white text-gray-900 text-sm outline-none transition-all ${registerErrors.username ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`} />
                      {registerErrors.username && <p className="text-xs text-red-500 mt-0.5">{registerErrors.username}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-[#7E7E86]" htmlFor="reg-email">Email</label>
                    <input
                      id="reg-email"
                      type="text"
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        if (registerErrors.email) setRegisterErrors({ ...registerErrors, email: "" });
                      }}
                      className={`w-full h-[46px] px-4 rounded-xl border bg-white text-gray-900 text-sm outline-none transition-all ${registerErrors.email ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`} />
                    {registerErrors.email && <p className="text-xs text-red-500 mt-0.5">{registerErrors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-[#7E7E86]" htmlFor="reg-password">Password</label>
                    <div className="relative">
                      <input
                        id="reg-password"
                        type={showRegPw ? "text" : "password"}
                        value={regPassword}
                        onChange={(e) => {
                          setRegPassword(e.target.value);
                          if (registerErrors.password) setRegisterErrors({ ...registerErrors, password: "" });
                        }}
                        className={`w-full h-[46px] px-4 pr-12 rounded-xl border bg-white text-gray-900 text-sm outline-none transition-all ${registerErrors.password ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`} />
                      <button type="button" onClick={() => setShowRegPw(!showRegPw)} tabIndex={-1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showRegPw ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    {registerErrors.password && <p className="text-xs text-red-500 mt-0.5">{registerErrors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-[#7E7E86]" htmlFor="reg-confirm">Confirm Password</label>
                    <div className="relative">
                      <input
                        id="reg-confirm"
                        type={showConfirmPw ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (registerErrors.confirmPassword) setRegisterErrors({ ...registerErrors, confirmPassword: "" });
                        }}
                        className={`w-full h-[46px] px-4 pr-12 rounded-xl border text-gray-900 text-sm outline-none transition-all bg-white ${registerErrors.confirmPassword ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                      />
                      <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} tabIndex={-1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showConfirmPw ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    {registerErrors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-0.5">{registerErrors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Terms */}
                  <p className="text-[0.82rem] text-gray-500 my-3">
                    By creating an account, you agree to the Terms of use and Privacy Policy.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="w-full h-[46px] rounded-full bg-[#5D5FEF] text-white text-sm hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right: Photo Panel (desktop only) ── */}
      <div ref={rightPanelRef} className="hidden md:block md:w-1/2 relative bg-indigo-50/50 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={carouselImages[currentImageIndex]}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={carouselImages[currentImageIndex]}
              alt="JobPilot – find and hire the best talent"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-900/40 to-transparent pointer-events-none z-10" />
      </div>

    </div>
  );
}