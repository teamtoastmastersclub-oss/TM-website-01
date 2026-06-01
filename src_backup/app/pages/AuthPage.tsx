import { useState } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { Toaster, toast } from 'sonner';
import { Mail, Lock, User, BookOpen, GraduationCap, Building, ArrowRight, ArrowLeft, Eye, EyeOff, X, ShieldCheck, HelpCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router"; 

type AuthMode = "login" | "signup" | "forgot-password";

export function AuthPage() {
  const location = useLocation();
  const getInitialMode = (): AuthMode => {
    if (location.pathname.includes("signup")) return "signup";
    if (location.pathname.includes("forgot-password")) return "forgot-password";
    return "login";
  };
  
  const [mode, setMode] = useState<AuthMode>(getInitialMode());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [usn, setUsn] = useState("");
  const [branch, setBranch] = useState("");
  const [sem, setSem] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [resetStep, setResetStep] = useState<1|2|3>(1);
  const [resetUsn, setResetUsn] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [showResetModal, setShowResetModal] = useState(false); // Added for consistency with the instruction's setShowResetModal

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      
      if (data.user?.role === 'admin') {
        setError("Unauthorized Node: Administrators must authenticate via the hidden terminal.");
        // Logout silently since the backend authenticated them but frontend rejects this route
        await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/auth/logout", { method: "POST", credentials: "include" });
      } else {
        navigate("/dashboard");
      }
    } catch(err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/auth/signup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, usn, branch, sem }),
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      
      if (data.user?.role === 'admin') {
        setError("Unauthorized Node: Administrators must authenticate via the hidden terminal.");
        await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/auth/logout", { method: "POST", credentials: "include" });
      } else {
        navigate("/dashboard");
      }
    } catch(err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage(""); setResetLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usn: resetUsn })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setResetStep(2); setResetMessage(data.message);
    } catch(err: any) { setResetMessage(err.message); } finally { setResetLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage(""); setResetLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/auth/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usn: resetUsn, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setResetStep(3); setResetMessage("");
    } catch(err: any) { setResetMessage(err.message); } finally { setResetLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) { setResetMessage("Passwords do not match."); return; }
    setResetMessage(""); setResetLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/auth/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usn: resetUsn, otp, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      if (res.ok) {
        toast.success("Password reset successfully. Please login.");
        setShowResetModal(false);
        setMode("login"); setResetStep(1); setResetUsn(""); setOtp(""); setNewPassword(""); setConfirmNewPassword("");
      }
    } catch(err: any) { setResetMessage(err.message); } finally { setResetLoading(false); }
  };

  const slideVariants: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden w-full relative">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-yellow-400/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-black/5 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[600px]"
      >
        <Link to="/" className="absolute top-4 right-4 md:top-6 md:right-8 z-50 text-xs sm:text-sm font-medium text-white md:text-gray-500 hover:text-yellow-400 md:hover:text-black flex items-center gap-1 sm:gap-2 transition-colors bg-white/10 md:bg-transparent px-3 py-1.5 md:p-0 rounded-full backdrop-blur-md md:backdrop-blur-none border border-white/20 md:border-none">
          <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to Home</span><span className="sm:hidden">Home</span>
        </Link>

        <div className="w-full md:w-1/2 bg-black text-white p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <path d="M0,0 L100,100 L100,0 Z" fill="currentColor" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <Link to="/">
              <h1 className="text-3xl font-bold tracking-tight hover:text-yellow-500 transition-colors inline-block cursor-pointer">
                KLECET<span className="text-yellow-500">.</span>
              </h1>
            </Link>
            <p className="text-xs text-gray-400 tracking-wider mt-1">TOASTMASTERS CLUB</p>
          </div>

          <div className="relative z-10 my-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-light leading-tight mb-6"
            >
              Master the art of <br />
              <span className="font-bold text-yellow-500">Communication.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 max-w-md"
            >
              Join a community of passionate individuals dedicated to personal growth, leadership, and public speaking excellence.
            </motion.p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-sm text-gray-400">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs font-bold">
                  TM
                </div>
              ))}
            </div>
            <p>Join 100+ active members</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex items-center bg-white relative">
          <div className="w-full max-w-md mx-auto">
            {error && <div className="mb-4 text-red-500 text-sm font-medium border border-red-200 bg-red-50 p-3 rounded-lg">{error}</div>}
            
            <AnimatePresence mode="wait">
              {/* LOGIN FORM */}
              {mode === "login" && (
                <motion.div
                  key="login"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-3xl font-bold mb-2">Welcome Back</h3>
                    <p className="text-gray-500">Please enter your details to sign in.</p>
                  </div>

                  <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 block">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Mail size={18} />
                        </div>
                        <input 
                          type="email" 
                          required
                          value={email} onChange={e => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                          placeholder="youremail@gmail.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 block">Password</label>
                        <button 
                          type="button"
                          onClick={() => { setMode("forgot-password"); setError(""); }}
                          className="text-xs font-semibold text-black hover:text-yellow-600 transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Lock size={18} />
                        </div>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required
                          value={password} onChange={e => setPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button disabled={loading} className="w-full bg-black text-white rounded-xl py-3 font-medium hover:bg-gray-900 transition-all flex items-center justify-center gap-2 group mt-2 disabled:opacity-50">
                      {loading ? 'Signing In...' : 'Sign In'}
                      {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </form>

                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button onClick={() => { setMode("signup"); setError(""); }} className="font-semibold text-black hover:text-yellow-600 transition-colors">
                      Join the Club
                    </button>
                  </p>
                </motion.div>
              )}

              {/* SIGNUP FORM */}
              {mode === "signup" && (
                <motion.div
                  key="signup"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-3xl font-bold mb-2">Create Account</h3>
                    <p className="text-gray-500">Join our community today.</p>
                  </div>

                  <form className="space-y-4" onSubmit={handleSignup}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 block">Full Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <User size={18} />
                          </div>
                          <input 
                            type="text" 
                            required
                            value={fullName} onChange={e => setFullName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                            placeholder="NAME"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 block">USN</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <BookOpen size={18} />
                          </div>
                          <input 
                            type="text" 
                            required
                            value={usn} onChange={e => setUsn(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all uppercase"
                            placeholder="Ex : 2KD23CS042"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 block">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Mail size={18} />
                        </div>
                        <input 
                          type="email" 
                          required
                          value={email} onChange={e => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                          placeholder="youremail@gmail.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-sm font-medium text-gray-700 block">Branch</label>
                         <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Building size={18} />
                          </div>
                          <select required value={branch} onChange={e => setBranch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all appearance-none cursor-pointer text-sm">
                            <option value="">Select</option>
                            <option value="CSE">CSE</option>
                            <option value="AIDS">AI & DS</option>
                            <option value="ECE">ECE</option>
                            <option value="MECH">Mechanical</option>
                            <option value="CIVIL">Civil</option>
                          </select>
                         </div>
                      </div>

                      <div className="space-y-1">
                         <label className="text-sm font-medium text-gray-700 block">Semester</label>
                         <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <GraduationCap size={18} />
                          </div>
                          <select required value={sem} onChange={e => setSem(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all appearance-none cursor-pointer text-sm">
                            <option value="">Select</option>
                            {[1,2,3,4,5,6,7,8].map(s => (
                              <option key={s} value={`Sem ${s}`}>Sem {s}</option>
                            ))}
                          </select>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 block">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Lock size={18} />
                        </div>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required
                          value={password} onChange={e => setPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 pt-1">Requires 1 uppercase, 1 lowercase, 1 number, & 1 special character.</div>
                    </div>

                    <button disabled={loading} className="w-full bg-black text-white rounded-xl py-3 font-medium hover:bg-gray-900 transition-all flex items-center justify-center gap-2 group mt-4 disabled:opacity-50">
                      {loading ? 'Creating...' : 'Create Account'}
                      {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </form>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button onClick={() => { setMode("login"); setError(""); }} className="font-semibold text-black hover:text-yellow-600 transition-colors">
                      Sign In
                    </button>
                  </p>
                </motion.div>
              )}

              {/* FORGOT PASSWORD FORM */}
              {mode === "forgot-password" && (
                <motion.div
                  key="forgot-password"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <button 
                    onClick={() => { setMode("login"); setError(""); setResetStep(1); setResetMessage(""); }}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-4"
                  >
                    <ArrowLeft size={16} /> Back to login
                  </button>

                  <div>
                    <h3 className="text-3xl font-bold mb-2">Reset Password</h3>
                    {resetStep === 1 && <p className="text-gray-500">Enter your core USN and we'll dispatch an OTP to your registered mailbox.</p>}
                    {resetStep === 2 && <p className="text-gray-500">Check your mailbox for the 6-digit recovery code.</p>}
                    {resetStep === 3 && <p className="text-gray-500">Recovery verified. Establish a new cryptographic passkey.</p>}
                  </div>

                  {resetMessage && (
                     <div className={`p-3 rounded-lg text-sm font-semibold border ${resetMessage.includes('OTP sent') ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                       {resetMessage}
                     </div>
                  )}

                  {resetStep === 1 && (
                    <form className="space-y-4" onSubmit={handleRequestOtp}>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 block">University Seat Number (USN)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <BookOpen size={18} />
                          </div>
                          <input 
                            type="text" 
                            required
                            value={resetUsn} onChange={e => setResetUsn(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all uppercase"
                            placeholder="01FE21B..."
                          />
                        </div>
                      </div>

                      <button disabled={resetLoading} className="w-full bg-black text-white rounded-xl py-3 font-medium hover:bg-gray-900 transition-all flex items-center justify-center gap-2 group mt-2 disabled:opacity-50">
                        {resetLoading ? 'Authorizing...' : 'Request OTP'}
                        {!resetLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                      </button>
                    </form>
                  )}

                  {resetStep === 2 && (
                    <form className="space-y-4" onSubmit={handleVerifyOtp}>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 block">Verification Passcode</label>
                        <input 
                          type="text" 
                          required
                          value={otp} onChange={e => setOtp(e.target.value)}
                          maxLength={6}
                          className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all uppercase"
                          placeholder="000000"
                        />
                      </div>

                      <button disabled={resetLoading} className="w-full bg-black text-white rounded-xl py-3 font-medium hover:bg-gray-900 transition-all flex items-center justify-center gap-2 group mt-2 disabled:opacity-50">
                        {resetLoading ? 'Verifying...' : 'Verify Passcode'}
                      </button>
                    </form>
                  )}

                  {resetStep === 3 && (
                    <form className="space-y-4" onSubmit={handleResetPassword}>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-700 block">New Password</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                              <Lock size={18} />
                            </div>
                            <input 
                              type={showPassword ? "text" : "password"} 
                              required
                              value={newPassword} onChange={e => setNewPassword(e.target.value)}
                              className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                              placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-700 block">Repeat Password</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                              <Lock size={18} />
                            </div>
                            <input 
                              type={showConfirmPassword ? "text" : "password"} 
                              required
                              value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)}
                              className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                              placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Requires 1 uppercase, 1 lowercase, 1 number, & 1 special character.</div>

                      <button disabled={resetLoading} className="w-full bg-yellow-500 text-black font-bold uppercase tracking-widest rounded-xl py-3 hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
                        {resetLoading ? 'Finalizing...' : 'Reset Password'}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
