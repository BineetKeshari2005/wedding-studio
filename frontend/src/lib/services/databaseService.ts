/**
 * Database Service — Abstraction layer for project CRUD.
 * Currently backed by in-memory mocks. Swap the import source
 * to connect Firebase Firestore, Supabase, or any database.
 */

export {
  mockGetProjects as getProjects,
  mockSaveProject as saveProject,
  mockDeleteProject as deleteProject,
  type MockProject as Project,
} from "@/services/firebaseMock";
