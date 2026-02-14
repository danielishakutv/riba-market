import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  userType: "buyer" | "seller" | "both";
  businessName?: string;
  avatar?: string;
  bio?: string;
  isPro: boolean;
  createdAt: string;
}

interface AuthState {
  users: UserAccount[];
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: "REGISTER"; payload: UserAccount }
  | { type: "LOGIN"; payload: UserAccount }
  | { type: "LOGOUT" }
  | { type: "UPDATE_PROFILE"; payload: Partial<UserAccount> };

const demoUser: UserAccount = {
  id: "demo-001",
  email: "demo@ribamarket.com",
  password: "password123",
  name: "Demo User",
  phone: "+234 800 000 0000",
  userType: "both",
  businessName: "Demo Store",
  isPro: false,
  bio: "This is a demo account for testing Riba Market.",
  createdAt: new Date().toISOString(),
};

const initialState: AuthState = {
  users: [demoUser],
  currentUser: null,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "REGISTER":
      return {
        ...state,
        users: [...state.users, action.payload],
        currentUser: action.payload,
        isAuthenticated: true,
      };
    case "LOGIN":
      return { ...state, currentUser: action.payload, isAuthenticated: true };
    case "LOGOUT":
      return { ...state, currentUser: null, isAuthenticated: false };
    case "UPDATE_PROFILE":
      const updated = { ...state.currentUser!, ...action.payload };
      return {
        ...state,
        currentUser: updated,
        users: state.users.map((u) => (u.id === updated.id ? updated : u)),
      };
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (user: Omit<UserAccount, "id" | "isPro" | "createdAt">) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<UserAccount>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(
    (email: string, password: string) => {
      const user = state.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!user) return { success: false, error: "Invalid email or password" };
      dispatch({ type: "LOGIN", payload: user });
      return { success: true };
    },
    [state.users]
  );

  const register = useCallback(
    (userData: Omit<UserAccount, "id" | "isPro" | "createdAt">) => {
      const exists = state.users.some(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase()
      );
      if (exists) return { success: false, error: "An account with this email already exists" };
      const newUser: UserAccount = {
        ...userData,
        id: `user-${Date.now()}`,
        isPro: false,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: "REGISTER", payload: newUser });
      return { success: true };
    },
    [state.users]
  );

  const logout = useCallback(() => dispatch({ type: "LOGOUT" }), []);
  const updateProfile = useCallback(
    (data: Partial<UserAccount>) => dispatch({ type: "UPDATE_PROFILE", payload: data }),
    []
  );

  return (
    <AuthContext.Provider value={{ state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
