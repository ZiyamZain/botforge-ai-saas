import { create } from "zustand";

interface Org {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  plan: string;
  hasOwnKey: boolean;
  botName: string;
  botColor: string;
  botGreeting: string;
}

interface AuthState {
  org: Org | null;
  token: string | null;
  setAuth: (org: Org, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  org: null,
  token: localStorage.getItem("token"),
  setAuth: (org, token) => {
    localStorage.setItem("token", token);
    set({ org, token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ org: null, token: null });
  },
}));