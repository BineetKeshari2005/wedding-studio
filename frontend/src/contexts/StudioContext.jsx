import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { 
  createStudioProject, 
  getStudioProject, 
  getStudioProjects,
  updateStudioProject, 
  saveSelection, 
  getMoodboard 
} from "../lib/services/studioService";

export const JOURNEY_STEPS = [
  "Entry",
  "Lounge",
  "Dining",
  "Bar",
  "Stage",
  "Photo Booth",
];

const getStorageKey = (key, userId) => `studio_${key}_${userId || 'anonymous'}`;

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
  const { user, isAuthenticated } = useAuth();
  const userId = user?.uid;

  const [projectId, setProjectId] = useState(() => loadFromStorage(getStorageKey('projectId', userId), null));
  const [loadingProject, setLoadingProject] = useState(false);

  const [selectedConcepts, setSelectedConcepts] = useState(() =>
    loadFromStorage(getStorageKey('selectedConcepts', userId), DEFAULT_SELECTED)
  );

  const [completedSections, setCompletedSections] = useState(() =>
    loadFromStorage(getStorageKey('completedSections', userId), [])
  );

  const [favorites, setFavorites] = useState(() =>
    loadFromStorage(getStorageKey('favorites', userId), [])
  );

  const [currentSection, setCurrentSection] = useState(() => 
    loadFromStorage(getStorageKey('currentSection', userId), "Entry")
  );

  const [preferences, setPreferences] = useState(() => 
    loadFromStorage(getStorageKey('preferences', userId), {})
  );

  // Reset state when user changes
  useEffect(() => {
    setProjectId(loadFromStorage(getStorageKey('projectId', userId), null));
    setSelectedConcepts(loadFromStorage(getStorageKey('selectedConcepts', userId), DEFAULT_SELECTED));
    setCompletedSections(loadFromStorage(getStorageKey('completedSections', userId), []));
    setFavorites(loadFromStorage(getStorageKey('favorites', userId), []));
    setCurrentSection(loadFromStorage(getStorageKey('currentSection', userId), "Entry"));
    setPreferences(loadFromStorage(getStorageKey('preferences', userId), {}));
  }, [userId]);

  // Sync state to local storage immediately for fast reload
  useEffect(() => { saveToStorage(getStorageKey('projectId', userId), projectId); }, [projectId, userId]);
  useEffect(() => { saveToStorage(getStorageKey('selectedConcepts', userId), selectedConcepts); }, [selectedConcepts, userId]);
  useEffect(() => { saveToStorage(getStorageKey('completedSections', userId), completedSections); }, [completedSections, userId]);
  useEffect(() => { saveToStorage(getStorageKey('favorites', userId), favorites); }, [favorites, userId]);
  useEffect(() => { saveToStorage(getStorageKey('currentSection', userId), currentSection); }, [currentSection, userId]);
  useEffect(() => { saveToStorage(getStorageKey('preferences', userId), preferences); }, [preferences, userId]);

  // Load project from backend on mount or auth change
  useEffect(() => {
    let mounted = true;
    const loadBackendState = async () => {
      if (!isAuthenticated || !projectId) return;
      try {
        setLoadingProject(true);
        const [projectData, moodboardData] = await Promise.all([
          getStudioProject(projectId),
          getMoodboard(projectId)
        ]);

        if (mounted) {
          if (projectData.completedSections) {
            setCompletedSections(projectData.completedSections);
          }
          if (projectData.currentSection) {
            setCurrentSection(projectData.currentSection);
          }

          if (projectData.weddingPreferences) {
            setPreferences(projectData.weddingPreferences);
          }

          // Transform moodboard concepts into selectedConcepts format
          const newSelected = { ...DEFAULT_SELECTED };
          for (const section of JOURNEY_STEPS) {
            if (moodboardData[section]) {
              newSelected[section] = moodboardData[section].map(c => ({
                id: c.id,
                imageUrl: c.imageUrl,
                prompt: c.prompt,
                generationId: c.generationId,
                selectedFilters: c.selectedFilters,
                referenceImagesUsed: c.referenceImagesUsed,
                isFavorite: c.isFavorite
              }));
            }
          }
          setSelectedConcepts(newSelected);
        }
      } catch (err) {
        console.error("Failed to load studio project from backend", err);
        // If not found, clear project id so a new one can be created
        if (err?.response?.status === 404 || err?.statusCode === 404) {
          if (mounted) setProjectId(null);
        }
      } finally {
        if (mounted) setLoadingProject(false);
      }
    };
    loadBackendState();
    return () => { mounted = false; };
  }, [isAuthenticated, projectId]);

  // Ensure project exists before mutations
  const ensureProject = async () => {
    if (!isAuthenticated) return null;
    if (projectId) return projectId;
    try {
      // First try to fetch an existing project for the user to handle cross-device logins
      const projects = await getStudioProjects();
      if (projects && projects.length > 0) {
        const existingPid = projects[0].id;
        setProjectId(existingPid);
        return existingPid;
      }
      // If no existing project, create a new one
      const p = await createStudioProject({ name: "My Wedding Vision" });
      setProjectId(p.id);
      return p.id;
    } catch (err) {
      console.error("Failed to ensure studio project", err);
      return null;
    }
  };

  const syncConceptsToBackend = async (stepName, concepts) => {
    const pid = await ensureProject();
    if (!pid) return;
    try {
      if (concepts.length > 0) {
        await saveSelection({
          projectId: pid,
          section: stepName,
          concepts: concepts.map(c => ({
            imageUrl: c.imageUrl || c.image, // accommodate existing format
            prompt: c.prompt,
            generationId: c.generationId,
            selectedFilters: c.selectedFilters,
            referenceImagesUsed: c.referenceImagesUsed,
            isFavorite: c.isFavorite || false
          }))
        });
      }
    } catch (err) {
      console.error("Failed to sync concepts to backend", err);
    }
  };

  // Toggle selection with duplicate prevention & backend sync
  const toggleSelection = useCallback(async (stepName, concept) => {
    let newConcepts;
    setSelectedConcepts((prev) => {
      const current = prev[stepName] || [];
      const exists = current.some((c) => c.id === concept.id);
      const updated = exists
        ? current.filter((c) => c.id !== concept.id)
        : [...current, concept];
      newConcepts = updated;
      return { ...prev, [stepName]: updated };
    });
    
    // Defer backend sync so UI is instant
    if (newConcepts && newConcepts.length > 0) {
      syncConceptsToBackend(stepName, newConcepts);
    }
  }, [isAuthenticated, projectId]);

  // Remove a single concept from a section & backend sync
  const removeConcept = useCallback(async (stepName, conceptId) => {
    let newConcepts;
    setSelectedConcepts((prev) => {
      const current = prev[stepName] || [];
      const updated = current.filter((c) => c.id !== conceptId);
      newConcepts = updated;
      return { ...prev, [stepName]: updated };
    });

    if (newConcepts && newConcepts.length > 0) {
      syncConceptsToBackend(stepName, newConcepts);
    }
  }, [isAuthenticated, projectId]);

  // Mark a section as completed & backend sync
  const completeSection = useCallback(async (stepName) => {
    let newCompleted;
    setCompletedSections((prev) => {
      if (prev.includes(stepName)) return prev;
      newCompleted = [...prev, stepName];
      return newCompleted;
    });

    if (newCompleted) {
      const pid = await ensureProject();
      if (pid) {
        try {
          await updateStudioProject(pid, { completedSections: newCompleted });
        } catch (err) {
          console.error("Failed to sync completedSections", err);
        }
      }
    }
  }, [isAuthenticated, projectId]);

  // Sync current section
  const setAndSyncCurrentSection = useCallback(async (sectionName) => {
    setCurrentSection(sectionName);
    const pid = await ensureProject();
    if (pid) {
      try {
        await updateStudioProject(pid, { currentSection: sectionName });
      } catch (err) {
        console.error("Failed to sync currentSection", err);
      }
    }
  }, [isAuthenticated, projectId]);

  const setAndSyncPreferences = useCallback(async (newPrefs) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPrefs };
      return updated;
    });
    const pid = await ensureProject();
    if (pid) {
      try {
        await updateStudioProject(pid, { weddingPreferences: newPrefs });
      } catch (err) {
        console.error("Failed to sync preferences", err);
      }
    }
  }, [isAuthenticated, projectId]);

  const toggleFavorite = useCallback((conceptId) => {
    setFavorites((prev) =>
      prev.includes(conceptId)
        ? prev.filter((id) => id !== conceptId)
        : [...prev, conceptId]
    );
  }, []);

  const value = {
    projectId,
    loadingProject,
    selectedConcepts,
    setSelectedConcepts,
    completedSections,
    setCompletedSections,
    favorites,
    setFavorites,
    currentSection,
    setCurrentSection: setAndSyncCurrentSection,
    preferences,
    setPreferences: setAndSyncPreferences,
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
