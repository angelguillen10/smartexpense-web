import { create } from 'zustand';
import { User } from '@/types';
import { authAPI } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, currency?: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isInitialized: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string, currency: string = 'USD') => {
    set({ isLoading: true });
    try {
      const response = await authAPI.register({ email, password, name, currency });
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, isInitialized: true });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await authAPI.getProfile();
      set({ user: response.data, token, isAuthenticated: true, isLoading: false, isInitialized: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false, isInitialized: true });
    }
  },
}));
