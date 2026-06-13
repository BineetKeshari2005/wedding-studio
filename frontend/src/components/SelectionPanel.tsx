import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MoodboardOptions {
  function: string;
  budget: number;
  guest: number;
  theme: string;
  celebration: string;
  time: string;
  vibe: string;
}

interface SelectionPanelProps {
  options: MoodboardOptions;
  onChange: (options: MoodboardOptions) => void;
  onGenerate?: () => void;
  hasSelections?: boolean;
  credits?: number;
}

const functions = ["Haldi", "Mehendi", "Sangeet", "Shaadi", "Reception"];
const themes = ["Royal", "Minimal", "Boho", "Traditional", "Pastel", "Art Deco"];
const venues = ["Palace", "Banquet", "Open Lawn", "Resort", "Beach", "Heritage Haveli"];
const times = [
  "Morning (Day light)",
  "Afternoon (Bright)",
  "Sunset (Golden Hour)",
  "Evening (Warm Glow)",
  "Night (Under Stars)"
];

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  options,
  onChange,
  onGenerate,
  hasSelections,
  credits = 0,
}) => {
  const update = (key: keyof MoodboardOptions, value: any) =>
    onChange({ ...options, [key]: value });

  const formatBudget = (val: number) => {
    if (val === 100) return "1 Cr";
    return `${val} L`;
  };

  return (
    <div className="space-y-6 p-6 overflow-y-auto max-h-[calc(100vh-5rem)]">
      <div>
        <h2 className="font-heading text-2xl text-foreground mb-1">Create Moodboard</h2>
        <p className="text-sm text-muted-foreground font-body">Select your wedding details</p>
      </div>

      <div className="space-y-4">
        {/* Function Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider block">
            Function
          </label>
          <Select
            value={options.function || undefined}
            onValueChange={(val) => update("function", val)}
          >
            <SelectTrigger className="h-11 rounded-xl bg-white/50 dark:bg-white/5 border-border/80 hover:border-lovers-blush/40 transition-all font-body text-sm text-foreground">
              <SelectValue placeholder="Select Function" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl z-50">
              {functions.map((pill) => (
                <SelectItem
                  key={pill}
                  value={pill}
                  className="rounded-lg font-body cursor-pointer py-2"
                >
                  {pill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Budget Slider Card */}
        <div className="p-4 rounded-xl border border-border/80 bg-white/30 dark:bg-white/5 space-y-3 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-xs font-body font-bold text-muted-foreground uppercase tracking-wider">
              Budget
            </span>
            <span className="text-sm font-body font-bold text-foreground">
              {formatBudget(options.budget)}
            </span>
          </div>
          <div className="px-1">
            <Slider
              value={[options.budget]}
              onValueChange={(val) => update("budget", val[0])}
              min={1}
              max={100}
              step={1}
              className="py-2 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground font-body font-medium">
            <span>1L</span>
            <span>1Cr</span>
          </div>
        </div>

        {/* Guest (PAX) Slider Card */}
        <div className="p-4 rounded-xl border border-border/80 bg-white/30 dark:bg-white/5 space-y-3 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-xs font-body font-bold text-muted-foreground uppercase tracking-wider">
              Guest (PAX)
            </span>
            <span className="text-sm font-body font-bold text-foreground">
              {options.guest}
            </span>
          </div>
          <div className="px-1">
            <Slider
              value={[options.guest]}
              onValueChange={(val) => update("guest", val[0])}
              min={0}
              max={1000}
              step={10}
              className="py-2 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground font-body font-medium">
            <span>0</span>
            <span>1000</span>
          </div>
        </div>

        {/* Theme Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider block">
            Theme
          </label>
          <Select
            value={options.theme || undefined}
            onValueChange={(val) => update("theme", val)}
          >
            <SelectTrigger className="h-11 rounded-xl bg-white/50 dark:bg-white/5 border-border/80 hover:border-lovers-blush/40 transition-all font-body text-sm text-foreground">
              <SelectValue placeholder="Select Theme" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl z-50">
              {themes.map((pill) => (
                <SelectItem
                  key={pill}
                  value={pill}
                  className="rounded-lg font-body cursor-pointer py-2"
                >
                  {pill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Venue Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider block">
            Venue
          </label>
          <Select
            value={options.celebration || undefined}
            onValueChange={(val) => update("celebration", val)}
          >
            <SelectTrigger className="h-11 rounded-xl bg-white/50 dark:bg-white/5 border-border/80 hover:border-lovers-blush/40 transition-all font-body text-sm text-foreground">
              <SelectValue placeholder="Select Venue" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl z-50">
              {venues.map((pill) => (
                <SelectItem
                  key={pill}
                  value={pill}
                  className="rounded-lg font-body cursor-pointer py-2"
                >
                  {pill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider block">
            Time
          </label>
          <Select
            value={options.time || undefined}
            onValueChange={(val) => update("time", val)}
          >
            <SelectTrigger className="h-11 rounded-xl bg-white/50 dark:bg-white/5 border-border/80 hover:border-lovers-blush/40 transition-all font-body text-sm text-foreground">
              <SelectValue placeholder="Select Time" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl z-50">
              {times.map((pill) => (
                <SelectItem
                  key={pill}
                  value={pill}
                  className="rounded-lg font-body cursor-pointer py-2"
                >
                  {pill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {onGenerate && (
        <div className="lg:hidden pt-4 border-t border-border/50">
          <Button
            onClick={onGenerate}
            disabled={!hasSelections || credits <= 0}
            className="w-full font-body px-8 glass-strong"
          >
            <Sparkles size={18} className="mr-2" />
            Generate Moodboard
          </Button>
          {credits <= 0 && (
            <p className="text-center text-xs text-destructive font-body mt-2">
              No credits remaining. Upgrade your plan for more.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectionPanel;
export type { MoodboardOptions };


