/**
 * Auth Service — Abstraction layer for authentication.
 * Currently backed by in-memory mocks. Swap the import source
 * to connect Firebase, Supabase, or any auth provider.
 */

export {
  mockSignUp as signUp,
  mockSignIn as signIn,
  mockSignOut as signOut,
  mockGetCurrentUser as getCurrentUser,
  mockGetProfile as getProfile,
  mockUpdateProfile as updateProfile,
  mockUpdatePassword as updatePassword,
  mockDeductCredit as deductCredit,
  mockSetPlan as setPlan,
  mockSignInWithGoogle as signInWithGoogle,
  type MockUser as User,
  type MockProfile as Profile,
} from "@/services/firebaseMock";
