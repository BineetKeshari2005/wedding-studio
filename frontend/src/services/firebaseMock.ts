// Mock Firebase service — swap with real Firebase SDK later

export interface MockUser {
  uid: string;
  email: string;
  displayName: string | null;
}

export interface MockProfile {
  uid: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  plan: "free" | "pro" | "pro_plus";
  credits: number;
  inviteCode: string;
  referredBy: string | null;
  createdAt: string;
}

export interface MockProject {
  id: string;
  userId: string;
  name: string;
  imageUrl: string | null;
  palette: string[];
  options: Record<string, string>;
  stages: Record<string, string>; // stageKey -> selected image
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// In-memory store
let currentUser: MockUser | null = null;
let currentProfile: MockProfile | null = null;
let projects: MockProject[] = [];

const generateId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const generateInviteCode = () => "LOVERS-" + Math.random().toString(36).slice(2, 8).toUpperCase();

// Auth
export const mockSignUp = async (email: string, _password: string, inviteCode?: string): Promise<MockProfile> => {
  await delay(500);
  const uid = generateId();
  currentUser = { uid, email, displayName: null };
  currentProfile = {
    uid,
    email,
    displayName: null,
    avatarUrl: null,
    plan: "free",
    credits: inviteCode ? 6 : 1, // 1 free + 5 if referred
    inviteCode: generateInviteCode(),
    referredBy: inviteCode || null,
    createdAt: new Date().toISOString(),
  };
  return currentProfile;
};

export const mockSignIn = async (email: string, _password: string): Promise<MockProfile> => {
  await delay(500);
  if (!currentProfile || currentProfile.email !== email) {
    // Create a default user if none exists
    const uid = generateId();
    currentUser = { uid, email, displayName: null };
    currentProfile = {
      uid,
      email,
      displayName: null,
      avatarUrl: null,
      plan: "free",
      credits: 1,
      inviteCode: generateInviteCode(),
      referredBy: null,
      createdAt: new Date().toISOString(),
    };
  }
  currentUser = { uid: currentProfile.uid, email, displayName: currentProfile.displayName };
  return currentProfile;
};

export const mockSignInWithGoogle = async (): Promise<MockProfile> => {
  await delay(800);
  const email = "google.user@example.com";
  if (!currentProfile) {
    const uid = generateId();
    currentUser = { uid, email, displayName: "Google User" };
    currentProfile = {
      uid,
      email,
      displayName: "Google User",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
      plan: "free",
      credits: 5,
      inviteCode: generateInviteCode(),
      referredBy: null,
      createdAt: new Date().toISOString(),
    };
  } else {
    currentUser = { uid: currentProfile.uid, email, displayName: currentProfile.displayName || "Google User" };
  }
  return currentProfile;
};

export const mockSignOut = async (): Promise<void> => {
  await delay(200);
  currentUser = null;
  currentProfile = null;
};

export const mockGetCurrentUser = (): MockUser | null => currentUser;
export const mockGetProfile = (): MockProfile | null => currentProfile;

export const mockUpdateProfile = async (updates: Partial<Pick<MockProfile, "displayName">>): Promise<MockProfile | null> => {
  await delay(300);
  if (!currentProfile) return null;
  currentProfile = { ...currentProfile, ...updates };
  if (currentUser && updates.displayName !== undefined) {
    currentUser = { ...currentUser, displayName: updates.displayName };
  }
  return currentProfile;
};

export const mockUpdatePassword = async (_newPassword: string): Promise<void> => {
  await delay(300);
};

export const mockDeductCredit = async (amount = 1): Promise<MockProfile | null> => {
  await delay(100);
  if (!currentProfile) return null;
  currentProfile = { ...currentProfile, credits: Math.max(0, currentProfile.credits - amount) };
  return currentProfile;
};

export const mockSetPlan = async (plan: MockProfile["plan"]): Promise<MockProfile | null> => {
  await delay(300);
  if (!currentProfile) return null;
  const creditsMap = { free: currentProfile.credits, pro: 3, pro_plus: 9999 };
  currentProfile = { ...currentProfile, plan, credits: creditsMap[plan] };
  return currentProfile;
};

// Projects
export const mockGetProjects = async (): Promise<MockProject[]> => {
  await delay(300);
  return projects.filter((p) => p.userId === currentUser?.uid);
};

export const mockSaveProject = async (project: Omit<MockProject, "id" | "userId" | "createdAt" | "updatedAt">): Promise<MockProject> => {
  await delay(300);
  const newProject: MockProject = {
    ...project,
    id: generateId(),
    userId: currentUser?.uid || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.unshift(newProject);
  return newProject;
};

export const mockDeleteProject = async (id: string): Promise<void> => {
  await delay(200);
  projects = projects.filter((p) => p.id !== id);
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
