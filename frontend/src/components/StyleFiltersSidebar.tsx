import React, { useState, useRef } from "react";

const FUNCTION_OPTIONS = [
  "Haldi",
  "Mehndi",
  "Sangeet",
  "Wedding Ceremony",
  "Reception",
  "Small Function",
];

const EVENT_FLOW_OPTIONS = [
  "Decor / Planning / Venue",
  "Fashion / Photography",
  "Sounds / Lights / Entertainment",
];

const VENUE_OPTIONS = ["Banquet", "Open Lawn"];
const TIMING_OPTIONS = [
  "Morning (Day light)",
  "Afternoon (Bright)",
  "Sunset (Golden Hour)",
  "Evening (Warm Glow)",
  "Night (Under Stars)",
];

const WEDDING_STYLE_OPTIONS = [
  "Modern Luxury",
  "Royal Traditional",
  "Boho",
  "Minimalist",
  "Contemporary",
  "Garden Elegant"
];

const COLOR_PALETTE_OPTIONS = [
  "Ivory & Gold",
  "Blush Pink",
  "White & Green",
  "Champagne",
  "Royal Red",
  "Pastel Garden",
  "Terracotta & Beige"
];

const formatBudgetLabel = (budget: number) => {
  if (budget >= 100) return "1 Cr";
  return `${budget} L`;
};

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`w-4 h-4 transform transition-transform duration-200 ${
      isOpen ? "rotate-180" : ""
    }`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const UploadIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default function StyleFiltersSidebar() {
  const [guestCount, setGuestCount] = useState<number>(100);
  const [budget, setBudget] = useState<number>(15);
  const [theme, setTheme] = useState<string>("Modern");
  const [functionType, setFunctionType] = useState<string>("Haldi");
  const [eventFlow, setEventFlow] = useState<string>("Decor / Planning / Venue");
  const [venueType, setVenueType] = useState<string>("Banquet");
  const [timing, setTiming] = useState<string>("Sunset (Golden Hour)");
  const [weddingStyle, setWeddingStyle] = useState<string>("Modern Luxury");
  const [colorPalette, setColorPalette] = useState<string>("Ivory & Gold");
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const renderCustomSelect = (
    id: string,
    label: string,
    value: string,
    onChange: (val: string) => void,
    options: string[]
  ) => {
    const isOpen = activeDropdown === id;

    return (
      <div
        className={`rounded-[8px] border border-white/10 bg-white/5 pt-2.5 pb-3 px-3 flex flex-col justify-between h-[84px] flex-shrink-0 relative ${
          isOpen ? "z-50" : "z-10"
        }`}
      >
        <span className="text-[15px] font-semibold uppercase tracking-[0.12em] text-[#ebd8c7] select-none">
          {label}
        </span>
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setActiveDropdown(isOpen ? null : id)}
            className="w-full flex items-center justify-between rounded-lg bg-[#f2dad0] text-[#251f1b] font-semibold px-2.5 py-1.5 text-[15px] outline-none text-left transition"
          >
            <span className="truncate">{value}</span>
            <span className="ml-1 flex-shrink-0">
              <ChevronIcon isOpen={isOpen} />
            </span>
          </button>

          {isOpen && (
            <div className="absolute right-0 left-0 z-50 w-full rounded-lg border border-white/10 bg-[#1d1714] p-1.5 shadow-xl flex flex-col gap-1 max-h-[160px] overflow-y-auto top-[calc(100%+6px)] loverai-scrollbar">
              {options.map((option) => {
                const isSelected = value === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setActiveDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between rounded-md px-2.5 py-1 text-left text-[15px] font-semibold hover:bg-white/5 transition ${
                      isSelected ? "text-[#ebd8c7]" : "text-white/85"
                    }`}
                  >
                    <span className="truncate">{option}</span>
                    {isSelected && (
                      <span className="text-[#e6c6b2] flex-shrink-0 ml-1">
                        <CheckIcon />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <aside className="w-[360px] flex-shrink-0 relative self-stretch">
      <div className="absolute inset-0 bg-[#201915]/40 backdrop-blur-md border border-white/10 rounded-[20px] p-3 flex flex-col overflow-hidden">
        <div className="pb-2.5 flex items-center justify-between flex-shrink-0 border-b border-white/10 mb-3">
          <h2 className="text-[15px] font-bold uppercase tracking-[0.22em] text-[#ebd8c7]">
            Style Filters
          </h2>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto pr-3 flex-1 min-h-0 loverai-scrollbar pb-4">
        
        {/* Reference Uploads */}
        <div className="rounded-[8px] border border-white/10 bg-white/5 pt-2.5 pb-3 px-3 flex flex-col justify-between h-[105px] flex-shrink-0 relative">
          <span className="text-[15px] font-semibold uppercase tracking-[0.12em] text-[#ebd8c7] select-none">
            Reference Uploads
          </span>
          <div className="border border-dashed border-white/20 rounded-lg bg-[#ebd8c7]/5 flex items-center justify-between px-3 py-2 h-[56px] min-h-[56px]">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <span className="text-[#ebd8c7] flex-shrink-0">
                <UploadIcon />
              </span>
              <p className="text-[11px] text-white/70 leading-snug select-none text-left">
                Add Your Inspiration (Instagram Reel,
                <br />
                Screenshot, Pinterest)
              </p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-md text-[11px] uppercase font-bold tracking-wider text-[#ebd8c7] transition flex-shrink-0"
            >
              Browse
            </button>
          </div>
        </div>

        {/* Budget Slider */}
        <div className="rounded-[8px] border border-white/10 bg-white/5 pt-2.5 pb-3 px-3 flex flex-col justify-between h-[84px] flex-shrink-0 relative">
          <div className="flex justify-between items-center">
            <span className="text-[15px] font-semibold uppercase tracking-[0.12em] text-[#ebd8c7] select-none">
              Budget
            </span>
            <span className="text-sm font-semibold text-white/95">
              {formatBudgetLabel(budget)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 select-none">1L</span>
            <input
              type="range"
              min="1"
              max="100"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="loverai-range-slider flex-1"
            />
            <span className="text-xs text-white/40 select-none">1Cr</span>
          </div>
        </div>

        {/* Functions Dropdown */}
        {renderCustomSelect(
          "functions",
          "Functions",
          functionType,
          setFunctionType,
          FUNCTION_OPTIONS
        )}

        {/* Guest Slider */}
        <div className="rounded-[8px] border border-white/10 bg-white/5 pt-2.5 pb-3 px-3 flex flex-col justify-between h-[84px] flex-shrink-0 relative">
          <div className="flex justify-between items-center">
            <span className="text-[15px] font-semibold uppercase tracking-[0.12em] text-[#ebd8c7] select-none">
              Guest (PAX)
            </span>
            <span className="text-sm font-semibold text-white/95">
              {guestCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 select-none">0</span>
            <input
              type="range"
              min="0"
              max="1000"
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="loverai-range-slider flex-1"
            />
            <span className="text-xs text-white/40 select-none">1000</span>
          </div>
        </div>

        {/* Theme Toggle Buttons */}
        <div className="rounded-[8px] border border-white/10 bg-white/5 pt-2.5 pb-3 px-3 flex flex-col justify-between h-[84px] flex-shrink-0 relative">
          <span className="text-[15px] font-semibold uppercase tracking-[0.12em] text-[#ebd8c7] select-none">
            Theme
          </span>
          <div className="grid grid-cols-2 gap-1.5 w-full">
            {["Modern", "Traditional"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTheme(option)}
                className={`rounded-[6px] py-1.5 text-[15px] font-semibold transition text-center w-full ${
                  theme === option
                    ? "bg-[#ebd0be] text-[#3D1B2D]"
                    : "border border-white/10 bg-white/5 text-white/70 hover:border-white/20"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Event Flow Dropdown */}
        {renderCustomSelect(
          "eventFlow",
          "Event Flow",
          eventFlow,
          setEventFlow,
          EVENT_FLOW_OPTIONS
        )}

        {/* Wedding Style */}
        {renderCustomSelect(
          "weddingStyle",
          "Wedding Style",
          weddingStyle,
          setWeddingStyle,
          WEDDING_STYLE_OPTIONS
        )}

        {/* Color Palette */}
        {renderCustomSelect(
          "colorPalette",
          "Color Palette",
          colorPalette,
          setColorPalette,
          COLOR_PALETTE_OPTIONS
        )}

        {/* Venue Dropdown */}
        {renderCustomSelect(
          "venue",
          "Venue",
          venueType,
          setVenueType,
          VENUE_OPTIONS
        )}

        {/* Timing Dropdown */}
        {renderCustomSelect(
          "timing",
          "Timing",
          timing,
          setTiming,
          TIMING_OPTIONS
        )}
      </div>
      </div>
    </aside>
  );
}
