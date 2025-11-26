'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useExpenseStore } from '@/store/expenseStore';
import { PlusCircle, LogOut, TrendingUp, DollarSign, CreditCard } from 'lucide-react';
import ExpenseChart from '@/components/ExpenseChart';
import ExpenseList from '@/components/ExpenseList';
import AddExpenseModal from '@/components/AddExpenseModal';
import toast from 'react-hot-toast';
import { Expense } from '@/types';
import { startOfMonth, endOfMonth } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, logout, loadUser } = useAuthStore();
  const {
    expenses,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getStatsByCategory,
  } = useExpenseStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [stats, setStats] = useState<{ category: string; total: number }[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      await fetchExpenses();

      const now = new Date();
      const start = startOfMonth(now);
      const end = endOfMonth(now);

      const categoryStats = await getStatsByCategory(
        start.toISOString(),
        end.toISOString()
      );
      setStats(categoryStats);

      const total = categoryStats.reduce((sum, cat) => sum + cat.total, 0);
      setMonthlyTotal(total);
    } catch (error) {
      toast.error('Failed to load expenses');
    }
  };

  const handleAddExpense = async (data: any) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, data);
        toast.success('Expense updated!');
        setEditingExpense(null);
      } else {
        await addExpense(data);
        toast.success('Expense added!');
      }
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to save expense');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        toast.success('Expense deleted!');
        loadDashboardData();
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">SmartExpense</h1>
              <p className="text-sm text-gray-400">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-white">${monthlyTotal.toFixed(2)}</p>
              </div>
              <div className="bg-primary-900/30 p-3 rounded-full">
                <DollarSign className="text-primary-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Expenses</p>
                <p className="text-2xl font-bold text-white">{expenses.length}</p>
              </div>
              <div className="bg-purple-900/30 p-3 rounded-full">
                <CreditCard className="text-purple-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-white">{stats.length}</p>
              </div>
              <div className="bg-green-900/30 p-3 rounded-full">
                <TrendingUp className="text-green-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => {
              setEditingExpense(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
          >
            <PlusCircle size={20} />
            <span>Add Expense</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ExpenseChart data={stats} />
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Monthly Breakdown</h3>
            <div className="space-y-3">
              {stats.map((stat) => (
                <div key={stat.category} className="flex justify-between items-center">
                  <span className="text-gray-300">{stat.category}</span>
                  <span className="font-semibold text-white">${stat.total.toFixed(2)}</span>
                </div>
              ))}
              {stats.length === 0 && (
                <p className="text-gray-500 text-center py-4">No data for this month</p>
              )}
            </div>
          </div>
        </div>

        <ExpenseList
          expenses={expenses.slice(0, 10)}
          onDelete={handleDeleteExpense}
          onEdit={handleEditExpense}
        />
      </main>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleAddExpense}
        initialData={editingExpense}
      />
    </div>
  );
}
