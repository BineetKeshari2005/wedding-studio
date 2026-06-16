import { api, setAccessToken } from "../api";

export interface Profile {
  uid: string;
  email: string;
  displayName?: string;
  credits: number;
  plan: "free" | "pro" | "agency";
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

const mapUserToProfile = (user: any): Profile => ({
  uid: user.id,
  email: user.email,
  displayName: user.name,
  credits: user.credits || 0,
  plan: user.plan || "free",
  role: user.role || "user",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const signUp = async (email: string, password: string, inviteCode?: string, name?: string): Promise<Profile> => {
  const response = await api.post("/auth/register", { email, password, name: name || "New User" });
  const { accessToken, user } = response.data.data;
  setAccessToken(accessToken);
  return mapUserToProfile(user);
};

export const signIn = async (email: string, password: string): Promise<Profile> => {
  const response = await api.post("/auth/login", { email, password });
  const { accessToken, user } = response.data.data;
  setAccessToken(accessToken);
  return mapUserToProfile(user);
};

export const signOut = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } finally {
    setAccessToken(null);
  }
};

export const getCurrentUser = async (): Promise<Profile | null> => {
  try {
    const response = await api.get("/auth/me");
    return mapUserToProfile(response.data.data.user);
  } catch (err) {
    return null;
  }
};

export const updateProfile = async (data: Partial<Profile>): Promise<Profile> => {
  throw new Error("Not implemented in backend yet");
};

export const updatePassword = async (newPassword: string): Promise<void> => {
  throw new Error("Not implemented in backend yet");
};

export const deductCredit = async (amount: number): Promise<Profile> => {
  throw new Error("Not implemented in backend yet");
};

export const setPlan = async (plan: Profile["plan"]): Promise<Profile> => {
  throw new Error("Not implemented in backend yet");
};

export const signInWithGoogle = async (): Promise<Profile> => {
  throw new Error("Google sign in not implemented in backend yet");
};
