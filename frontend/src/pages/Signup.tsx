import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);


const Signup = () => {
  const [accountType, setAccountType] = useState<"couple" | "planner">("couple");
  const [fullName, setFullName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, undefined, fullName);
      navigate("/studio");
    } catch (err: any) {
      toast({
        title: "Authentication Error",
        description: err?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/studio");
      toast({
        title: "Welcome! 🎉",
        description: "Successfully signed in with Google.",
      });
    } catch (err: any) {
      toast({
        title: "Google Authentication Error",
        description: err?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-brand-bg-base font-body">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/signup.png')" }}
      />
      {/* Overlays */}
      <div className="absolute inset-0 z-0 bg-[#1A100B]/70 mix-blend-multiply" />
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#1A100B]/90 via-[#1A100B]/40 to-transparent" />
      
      {/* Glow Effects */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="absolute w-[800px] h-[800px] bg-[#E6C6B2]/15 rounded-full blur-[140px] mix-blend-screen opacity-50 -translate-x-1/4" />
        <div className="absolute w-[600px] h-[600px] bg-[#D6AE88]/15 rounded-full blur-[120px] mix-blend-screen opacity-40 translate-x-1/3 translate-y-1/4" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[1200px]"
      >
        <div className="flex flex-col lg:flex-row bg-[#1C120C]/30 backdrop-blur-[24px] border border-white/10 rounded-[40px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Inner Highlight */}
          <div className="absolute inset-0 rounded-[40px] ring-1 ring-inset ring-white/5 pointer-events-none z-20" />

          {/* Left Side - Branding */}
          <div className="relative lg:w-[58%] p-10 lg:p-16 flex flex-col justify-end min-h-[400px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="relative z-10 mt-auto">
              <div className="text-brand-heading text-sm tracking-[0.2em] font-medium mb-6 opacity-90 uppercase">
                Lovers AI
              </div>
              <h1 className="font-heading text-5xl lg:text-[64px] leading-[1.1] text-brand-heading mb-6 tracking-wide text-balance">
                Start your wedding <br /> story here
              </h1>
              <p className="text-brand-text-secondary text-lg leading-relaxed max-w-md font-light text-balance">
                Create an account to begin planning your wedding celebration with AI-powered customization, customized moodboards, and tools.
              </p>
            </div>
            {/* Subtle left side glow */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E6C6B2]/10 blur-[100px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/4" />
          </div>

          {/* Right Side - Form */}
          <div className="relative lg:w-[42%] p-10 lg:p-14 bg-[#1C120C]/20">
            <div className="max-w-[400px] mx-auto">
              {/* Header */}
              <div className="flex items-center gap-4 mb-10">
                <div className="text-white font-heading text-3xl tracking-tight relative leading-none">
                  Lovers<span className="absolute -bottom-1 -right-4 text-xs opacity-80">AI</span>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div>
                  <h2 className="text-brand-heading text-xl font-medium">Create Account</h2>
                  <p className="text-brand-text-muted text-[13px] font-light">Join the LoversAI experience</p>
                </div>
              </div>

              {/* Account Type Switcher */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setAccountType("couple")}
                  className={`flex-1 h-[48px] flex items-center justify-center gap-2 rounded-2xl text-[14px] font-medium transition-all duration-300 ${
                    accountType === "couple"
                      ? "bg-[#E6C6B2]/15 text-[#E6C6B2] border border-[#E6C6B2]/30"
                      : "bg-white/5 text-brand-text-secondary border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <HeartIcon />
                  Couple
                </button>
                <button
                  onClick={() => setAccountType("planner")}
                  className={`flex-1 h-[48px] flex items-center justify-center gap-2 rounded-2xl text-[14px] font-medium transition-all duration-300 ${
                    accountType === "planner"
                      ? "bg-[#E6C6B2]/15 text-[#E6C6B2] border border-[#E6C6B2]/30"
                      : "bg-white/5 text-brand-text-secondary border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <ClipboardIcon />
                  Planner
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-brand-heading text-[13px] font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted">
                      <UserIcon />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      className="w-full h-[52px] pl-11 pr-5 rounded-2xl bg-white/5 border border-white/10 text-brand-heading placeholder:text-brand-text-muted focus:bg-white/10 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 outline-none transition-all duration-300 font-light"
                    />
                  </div>
                </div>

                {accountType === "couple" && (
                  <div>
                    <label className="block text-brand-heading text-[13px] font-medium mb-2">
                      Partner's Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted">
                        <HeartIcon />
                      </div>
                      <input
                        type="text"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="Partner's name"
                        className="w-full h-[52px] pl-11 pr-5 rounded-2xl bg-white/5 border border-white/10 text-brand-heading placeholder:text-brand-text-muted focus:bg-white/10 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 outline-none transition-all duration-300 font-light"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-brand-heading text-[13px] font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted">
                      <MailIcon />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full h-[52px] pl-11 pr-5 rounded-2xl bg-white/5 border border-white/10 text-brand-heading placeholder:text-brand-text-muted focus:bg-white/10 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 outline-none transition-all duration-300 font-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-brand-heading text-[13px] font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted">
                      <LockIcon />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-[52px] pl-11 pr-12 rounded-2xl bg-white/5 border border-white/10 text-brand-heading placeholder:text-brand-text-muted focus:bg-white/10 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 outline-none transition-all duration-300 font-light"
                    />
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text-secondary transition-colors">
                      <EyeIcon />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] mt-6 rounded-2xl bg-brand-primary text-brand-button-text font-medium text-[15px] hover:bg-brand-primary/90 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_20px_-4px_rgba(230,198,178,0.4)]"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="relative my-8 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative px-4 bg-transparent backdrop-blur-sm text-brand-text-dim text-[13px] tracking-wide">
                  Or continue with
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-[52px] flex items-center justify-center gap-3 rounded-2xl bg-white/5 border border-white/10 text-brand-heading font-medium text-[15px] hover:bg-white/10 transition-all duration-300"
              >
                <GoogleIcon />
                Sign up with Google
              </button>

              <div className="mt-8 text-center">
                <p className="text-brand-text-secondary text-[14px]">
                  Already have an account?{" "}
                  <Link to="/login" className="text-brand-heading font-medium hover:text-brand-primary transition-colors">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
