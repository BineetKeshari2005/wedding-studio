import React, { useState, useCallback, useRef, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import StudioSidebar from "@/components/StudioSidebar";
import SelectionPanel from "@/components/SelectionPanel";
import StageWizard from "@/components/StageWizard";
import type { MoodboardOptions } from "@/components/SelectionPanel";
import { Upload, Sparkles, Monitor, LayoutTemplate, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Studio: React.FC = () => {
  const { profile, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [wizardActive, setWizardActive] = useState(false);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const uploadRef = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<MoodboardOptions>({
    function: "",
    budget: 50,
    guest: 200,
    theme: "",
    celebration: "",
    time: "",
    vibe: "",
  });
  const [activeStudioTab, setActiveStudioTab] = useState<"options" | "canvas">("options");

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (uploadRef.current && !uploadRef.current.contains(e.target as Node)) {
        setUploadOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleStartGeneration = useCallback(() => {
    setWizardActive(true);
    setActiveStudioTab("canvas");
  }, []);

  const hasSelections = options.function || options.theme || options.celebration || options.time;

  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <StudioSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((p) => !p)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar — Vibe + Upload Dropdown */}
        <div className="glass m-3 mb-0 rounded-xl p-4 pl-16 lg:pl-4 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Describe the Vibe
            </label>
            <Input
              value={options.vibe}
              onChange={(e) => setOptions((o) => ({ ...o, vibe: e.target.value }))}
              placeholder="e.g. Romantic garden with cascading florals"
              className="bg-background/50 font-body"
            />
          </div>

          {/* Upload Dropdown */}
          <div className="shrink-0 relative" ref={uploadRef}>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                setReferenceFile(e.target.files?.[0] || null);
                setUploadOpen(false);
              }}
            />
            <Button
              variant="outline"
              className="glass font-body"
              onClick={() => setUploadOpen((p) => !p)}
            >
              <Upload size={16} className="mr-2" />
              {referenceFile ? referenceFile.name.slice(0, 20) : "Upload Reference"}
              <ChevronDown
                size={14}
                className={`ml-2 transition-transform duration-200 ${uploadOpen ? "rotate-180" : ""}`}
              />
            </Button>

            {/* Glassmorphic Dropdown Menu */}
            {uploadOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-xl shadow-xl shadow-black/10 z-50 overflow-hidden animate-fade-in">
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setUploadOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-body text-gray-700 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-lovers-blush/10 flex items-center justify-center shrink-0">
                    <Monitor size={16} className="text-lovers-blush" />
                  </div>
                  <div className="text-left">
                    <span className="block font-medium">Upload from Device</span>
                    <span className="block text-xs text-gray-400">JPG, PNG, WEBP</span>
                  </div>
                </button>
                <div className="h-px bg-gradient-to-r from-transparent via-lovers-blush/15 to-transparent" />
                <button
                  onClick={() => {
                    setUploadOpen(false);
                    navigate("/templates");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-body text-gray-700 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-lovers-gold/10 flex items-center justify-center shrink-0">
                    <LayoutTemplate size={16} className="text-lovers-gold" />
                  </div>
                  <div className="text-left">
                    <span className="block font-medium">Select a Template</span>
                    <span className="block text-xs text-gray-400">Premium moodboards</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden mx-3 mt-3 bg-white/30 dark:bg-white/5 rounded-xl p-1 border border-white/20 dark:border-white/5 shrink-0">
          <button
            onClick={() => setActiveStudioTab("options")}
            className={cn(
              "flex-1 py-2 text-xs font-body font-medium rounded-lg transition-all",
              activeStudioTab === "options"
                ? "bg-white/60 dark:bg-white/10 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Options
          </button>
          <button
            onClick={() => setActiveStudioTab("canvas")}
            className={cn(
              "flex-1 py-2 text-xs font-body font-medium rounded-lg transition-all",
              activeStudioTab === "canvas"
                ? "bg-white/60 dark:bg-white/10 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Canvas {wizardActive && "✨"}
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row min-w-0 overflow-hidden">
          {/* Left panel — selections */}
          <div className={cn(
            "w-full lg:w-[340px] border-r border-border shrink-0 overflow-hidden",
            activeStudioTab === "options" ? "block" : "hidden lg:block"
          )}>
            <SelectionPanel
              options={options}
              onChange={setOptions}
              onGenerate={handleStartGeneration}
              hasSelections={hasSelections}
              credits={profile?.credits ?? 0}
            />
          </div>

          {/* Canvas / Wizard */}
          <div className={cn(
            "flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto",
            activeStudioTab === "canvas" ? "flex" : "hidden lg:flex"
          )}>
            {wizardActive ? (
              <StageWizard options={options} onClose={() => setWizardActive(false)} />
            ) : (
              <div className="flex flex-col items-center gap-6 text-center max-w-md">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="text-primary" size={36} />
                </div>
                <div>
                  <h3 className="font-heading text-2xl text-foreground mb-2">Your Canvas Awaits</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    Select your wedding details on the left, then generate a stunning 5-stage moodboard powered by AI.
                  </p>
                </div>
                <Button
                  onClick={handleStartGeneration}
                  disabled={!hasSelections || (profile?.credits ?? 0) <= 0}
                  size="lg"
                  className="font-body px-8 glass-strong"
                >
                  <Sparkles size={18} className="mr-2" />
                  Generate Moodboard
                </Button>
                {(profile?.credits ?? 0) <= 0 && (
                  <p className="text-xs text-destructive font-body">
                    No credits remaining. Upgrade your plan for more.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
