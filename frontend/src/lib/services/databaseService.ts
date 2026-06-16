import { api } from "../api";

export interface Project {
  id: string;
  userId: string;
  name: string;
  imageUrl: string | null;
  palette: string[];
  options: Record<string, string>;
  stages: Record<string, string>;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get("/projects");
  return response.data.data.projects;
};

export const saveProject = async (project: Omit<Project, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Project> => {
  const response = await api.post("/projects", project);
  return response.data.data.project;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};
