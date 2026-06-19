import { api } from "../api";

export interface StudioProject {
  id: string;
  userId: string;
  name: string;
  status: string;
  weddingPreferences: Record<string, any>;
  selectedReferences: Record<string, any>;
  completedSections: string[];
  currentSection: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedConcept {
  id: string;
  projectId: string;
  section: string;
  imageUrl: string;
  prompt: string | null;
  generationId: string | null;
  selectedFilters: Record<string, any> | null;
  referenceImagesUsed: any | null;
  isFavorite: boolean;
  createdAt: string;
}

export const createStudioProject = async (data: { name: string; weddingPreferences?: Record<string, any> }): Promise<StudioProject> => {
  const response = await api.post("/studio/project", data);
  return response.data.data;
};

export const getStudioProject = async (id: string): Promise<StudioProject> => {
  const response = await api.get(`/studio/project/${id}`);
  return response.data.data;
};

export const getStudioProjects = async (): Promise<StudioProject[]> => {
  const response = await api.get("/studio/projects");
  return response.data.data;
};

export const updateStudioProject = async (id: string, data: Partial<StudioProject>): Promise<StudioProject> => {
  const response = await api.patch(`/studio/project/${id}`, data);
  return response.data.data;
};

export const saveSelection = async (data: {
  projectId: string;
  section: string;
  concepts: Array<{
    imageUrl: string;
    prompt?: string;
    generationId?: string;
    selectedFilters?: Record<string, any>;
    referenceImagesUsed?: any;
    isFavorite?: boolean;
  }>;
}): Promise<SavedConcept[]> => {
  const response = await api.post("/studio/save-selection", data);
  return response.data.data;
};

export const getMoodboard = async (projectId: string): Promise<Record<string, SavedConcept[]>> => {
  const response = await api.get(`/studio/moodboard/${projectId}`);
  return response.data.data;
};
