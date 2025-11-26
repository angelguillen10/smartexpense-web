import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: { email: string; password: string; name: string; currency?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
};

export const expenseAPI = {
  create: (data: any) => api.post('/expenses', data),
  getAll: (params?: { startDate?: string; endDate?: string }) =>
    api.get('/expenses', { params }),
  getById: (id: string) => api.get(`/expenses/${id}`),
  update: (id: string, data: any) => api.put(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
  getStatsByCategory: (startDate: string, endDate: string) =>
    api.get('/expenses/stats/by-category', { params: { startDate, endDate } }),
  getMonthlyTotal: (year: number, month: number) =>
    api.get('/expenses/stats/monthly-total', { params: { year, month } }),
};

export const budgetAPI = {
  create: (data: any) => api.post('/budgets', data),
  getAll: () => api.get('/budgets'),
  getAlerts: () => api.get('/budgets/alerts'),
  update: (id: string, data: any) => api.put(`/budgets/${id}`, data),
  delete: (id: string) => api.delete(`/budgets/${id}`),
};

export const aiAPI = {
  scanReceipt: (file: File) => {
    const formData = new FormData();
    formData.append('receipt', file);
    return api.post('/ai/scan-receipt', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  categorize: (description: string) =>
    api.post('/ai/categorize', { description }),
  predictExpenses: () => api.get('/ai/predict-expenses'),
  getBudgetSuggestions: (monthlyIncome: number) =>
    api.get('/ai/budget-suggestions', { params: { monthlyIncome } }),
};
