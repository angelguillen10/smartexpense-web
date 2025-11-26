'use client';

import { Expense } from '@/types';
import { format } from 'date-fns';
import { Trash2, Edit } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

export default function ExpenseList({ expenses, onDelete, onEdit }: ExpenseListProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Recent Expenses</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-700/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{expense.description}</p>
                  {expense.aiGenerated && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      AI
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {expense.category}
                  </span>
                  <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                  {expense.tags.length > 0 && (
                    <span className="text-xs">
                      {expense.tags.map((tag) => `#${tag}`).join(' ')}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-white">
                  ${expense.amount.toFixed(2)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No expenses yet</p>
        )}
      </div>
    </div>
  );
}
