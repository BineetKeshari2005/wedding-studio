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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
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
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-brand-bg-base font-body">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/bridal.png')" }}
      />
      {/* Overlays */}
      <div className="absolute inset-0 z-0 bg-[#1A100B]/60 mix-blend-multiply" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#1A100B]/90 via-[#1A100B]/40 to-transparent" />
      
      {/* Glow Effects */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-[#E6C6B2]/20 rounded-full blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute w-[400px] h-[400px] bg-[#D6AE88]/15 rounded-full blur-[100px] mix-blend-screen opacity-40 translate-y-20" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <div className="bg-[#1C120C]/40 backdrop-blur-[24px] border border-white/10 rounded-[32px] p-8 sm:p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Inner Highlight */}
          <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/5 pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="text-white font-heading text-3xl tracking-tight relative">
                Lovers<span className="absolute -bottom-2 -right-4 text-sm opacity-80">AI</span>
              </div>
            </div>
            <h1 className="font-heading text-4xl text-brand-heading mb-3 font-normal tracking-wide">
              Welcome Back
            </h1>
            <p className="text-brand-text-secondary text-[15px] font-light">
              Sign in to continue your journey with us
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="block text-brand-heading text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-[52px] px-5 rounded-2xl bg-white/5 border border-white/10 text-brand-heading placeholder:text-brand-text-muted focus:bg-white/10 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 outline-none transition-all duration-300 font-light"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-brand-heading text-sm font-medium">
                    Password
                  </label>
                  <Link to="#" className="text-brand-text-secondary hover:text-brand-heading text-[13px] transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-[52px] px-5 pr-16 rounded-2xl bg-white/5 border border-white/10 text-brand-heading placeholder:text-brand-text-muted focus:bg-white/10 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 outline-none transition-all duration-300 font-light"
                  />
                  <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text-secondary text-[13px] transition-colors">
                    Show
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded-[6px] border border-white/20 bg-white/5 group-hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="absolute opacity-0 cursor-pointer w-0 h-0"
                  />
                  {rememberMe && (
                    <motion.svg 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-3 h-3 text-brand-primary" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
                <span className="text-brand-text-secondary text-[13px] select-none">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] rounded-2xl bg-brand-primary text-brand-button-text font-medium text-[15px] hover:bg-brand-primary/90 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_20px_-4px_rgba(230,198,178,0.4)] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              {loading ? "Signing in..." : "Sign In"}
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
            Sign in with Google
          </button>

          <div className="mt-8 text-center">
            <p className="text-brand-text-secondary text-[14px]">
              Don't have an account?{" "}
              <Link to="/signup" className="text-brand-heading font-medium hover:text-brand-primary transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
