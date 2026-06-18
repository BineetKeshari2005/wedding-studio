import { createContext, useContext, useState, useEffect, useCallback } from "react";

export const JOURNEY_STEPS = [
  "Entry",
  "Lounge",
  "Dining",
  "Bar",
  "Stage",
  "Photo Booth",
];

const STORAGE_KEYS = {
  selectedConcepts: "studio_selectedConcepts",
  completedSections: "studio_completedSections",
  favorites: "studio_favorites",
};

const DEFAULT_SELECTED = {
  Entry: [],
  Lounge: [],
  Dining: [],
  Bar: [],
  Stage: [],
  "Photo Booth": [],
};

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupt data — ignore
  }
  return fallback;
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full — ignore
  }
}

const StudioContext = createContext(null);

export function StudioProvider({ children }) {
  const [selectedConcepts, setSelectedConcepts] = useState(() =>
    loadFromStorage(STORAGE_KEYS.selectedConcepts, DEFAULT_SELECTED)
  );

  const [completedSections, setCompletedSections] = useState(() =>
    loadFromStorage(STORAGE_KEYS.completedSections, [])
  );

  const [favorites, setFavorites] = useState(() =>
    loadFromStorage(STORAGE_KEYS.favorites, [])
  );

  // Persist on every change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.selectedConcepts, selectedConcepts);
  }, [selectedConcepts]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.completedSections, completedSections);
  }, [completedSections]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.favorites, favorites);
  }, [favorites]);

  // Toggle selection with duplicate prevention
  const toggleSelection = useCallback((stepName, concept) => {
    setSelectedConcepts((prev) => {
      const current = prev[stepName] || [];
      const exists = current.some((c) => c.id === concept.id);
      const updated = exists
        ? current.filter((c) => c.id !== concept.id)
        : [...current, concept];
      return { ...prev, [stepName]: updated };
    });
  }, []);

  // Remove a single concept from a section
  const removeConcept = useCallback((stepName, conceptId) => {
    setSelectedConcepts((prev) => {
      const current = prev[stepName] || [];
      return { ...prev, [stepName]: current.filter((c) => c.id !== conceptId) };
    });
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((conceptId) => {
    setFavorites((prev) =>
      prev.includes(conceptId)
        ? prev.filter((id) => id !== conceptId)
        : [...prev, conceptId]
    );
  }, []);

  // Mark a section as completed
  const completeSection = useCallback((stepName) => {
    setCompletedSections((prev) =>
      prev.includes(stepName) ? prev : [...prev, stepName]
    );
  }, []);

  const value = {
    selectedConcepts,
    setSelectedConcepts,
    completedSections,
    setCompletedSections,
    favorites,
    setFavorites,
    toggleSelection,
    removeConcept,
    toggleFavorite,
    completeSection,
  };

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  );
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return ctx;
}
