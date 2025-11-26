export interface User {
  id: string;
  email: string;
  name: string;
  currency: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  receiptUrl?: string;
  isRecurring: boolean;
  tags: string[];
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  period: 'monthly' | 'weekly' | 'yearly';
  alertThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAlert {
  budgetId: string;
  category: string;
  limit: number;
  spent: number;
  percentage: number;
  exceeded: boolean;
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface Prediction {
  category: string;
  predicted: number;
}

export interface BudgetSuggestion {
  category: string;
  suggested: number;
  reason: string;
}
