import { create } from 'zustand';
import { Expense, CategoryTotal } from '@/types';
import { expenseAPI } from '@/lib/api';

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  fetchExpenses: (params?: { startDate?: string; endDate?: string }) => Promise<void>;
  addExpense: (data: any) => Promise<void>;
  updateExpense: (id: string, data: any) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  getStatsByCategory: (startDate: string, endDate: string) => Promise<CategoryTotal[]>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  isLoading: false,

  fetchExpenses: async (params) => {
    set({ isLoading: true });
    try {
      const response = await expenseAPI.getAll(params);
      set({ expenses: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addExpense: async (data) => {
    set({ isLoading: true });
    try {
      const response = await expenseAPI.create(data);
      set((state) => ({
        expenses: [response.data, ...state.expenses],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateExpense: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await expenseAPI.update(id, data);
      set((state) => ({
        expenses: state.expenses.map((exp) =>
          exp.id === id ? response.data : exp
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteExpense: async (id) => {
    set({ isLoading: true });
    try {
      await expenseAPI.delete(id);
      set((state) => ({
        expenses: state.expenses.filter((exp) => exp.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getStatsByCategory: async (startDate, endDate) => {
    const response = await expenseAPI.getStatsByCategory(startDate, endDate);
    return response.data;
  },
}));
