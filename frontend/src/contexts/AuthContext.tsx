import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  signUp as svcSignUp,
  signIn as svcSignIn,
  signOut as svcSignOut,
  getProfile as svcGetProfile,
  updateProfile as svcUpdateProfile,
  updatePassword as svcUpdatePassword,
  deductCredit as svcDeductCredit,
  setPlan as svcSetPlan,
  signInWithGoogle as svcSignInWithGoogle,
  type Profile,
} from "@/lib/services/authService";

interface AuthContextType {
  user: { uid: string; email: string } | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, inviteCode?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  deductCredit: (amount?: number) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  upgradePlan: (plan: Profile["plan"]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ uid: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading] = useState(false);

  const signup = useCallback(async (email: string, password: string, inviteCode?: string) => {
    const p = await svcSignUp(email, password, inviteCode);
    setUser({ uid: p.uid, email: p.email });
    setProfile(p);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const p = await svcSignIn(email, password);
    setUser({ uid: p.uid, email: p.email });
    setProfile(p);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const p = await svcSignInWithGoogle();
    setUser({ uid: p.uid, email: p.email });
    setProfile(p);
  }, []);

  const logout = useCallback(async () => {
    await svcSignOut();
    setUser(null);
    setProfile(null);
  }, []);

  const deductCredit = useCallback(async (amount = 1) => {
    const p = await svcDeductCredit(amount);
    if (p) setProfile({ ...p });
  }, []);

  const refreshProfile = useCallback(async () => {
    const p = svcGetProfile();
    if (p) setProfile({ ...p });
  }, []);

  const updateDisplayName = useCallback(async (name: string) => {
    const p = await svcUpdateProfile({ displayName: name });
    if (p) setProfile({ ...p });
  }, []);

  const changePassword = useCallback(async (newPassword: string) => {
    await svcUpdatePassword(newPassword);
  }, []);

  const upgradePlan = useCallback(async (plan: Profile["plan"]) => {
    const p = await svcSetPlan(plan);
    if (p) setProfile({ ...p });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        deductCredit,
        refreshProfile,
        updateDisplayName,
        changePassword,
        upgradePlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
