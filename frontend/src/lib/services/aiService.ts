/**
 * AI Service — Abstraction layer for AI moodboard generation.
 * Currently backed by mock data. Swap the import source
 * to connect your custom AI API.
 */

export type { GeneratedResult, GeneratedImage } from "@/services/aiMock";
export { generateStageImages } from "@/services/aiMock";

// ── Stage definitions (6 stages) ──
// Centralized here so the wizard and any other consumer import from one place.

export const STAGES = [
  { key: "entry", label: "Entry", icon: "🚪" },
  { key: "lounge", label: "Lounge", icon: "🛋️" },
  { key: "dining", label: "Dining", icon: "🪑" },
  { key: "bar", label: "Bar", icon: "🍸" },
  { key: "stage", label: "Stage", icon: "🎭" },
  { key: "food_court", label: "Food Court", icon: "🍽️" },
] as const;

export type StageKey = (typeof STAGES)[number]["key"];
