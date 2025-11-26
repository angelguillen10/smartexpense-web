'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Sparkles } from 'lucide-react';
import { aiAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddExpenseModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount?.toString() || '');
      setCategory(initialData.category || '');
      setDescription(initialData.description || '');
      setDate(
        initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : ''
      );
    } else {
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date),
    });
    onClose();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const response = await aiAPI.scanReceipt(file);
      const { expense } = response.data;

      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDescription(expense.description);
      setDate(new Date(expense.date).toISOString().split('T')[0]);

      toast.success('Receipt scanned successfully!');
    } catch (error) {
      toast.error('Failed to scan receipt');
    } finally {
      setIsScanning(false);
    }
  };

  const handleAICategorize = async () => {
    if (!description) {
      toast.error('Please enter a description first');
      return;
    }

    try {
      const response = await aiAPI.categorize(description);
      setCategory(response.data.category);
      toast.success('Category suggested by AI!');
    } catch (error) {
      toast.error('Failed to categorize');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors text-gray-300">
            <Upload size={20} className="mr-2" />
            <span className="text-sm">
              {isScanning ? 'Scanning...' : 'Scan Receipt (AI)'}
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isScanning}
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
              placeholder="Coffee, groceries, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
                placeholder="Food, Transport, etc."
              />
              <button
                type="button"
                onClick={handleAICategorize}
                className="px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                title="AI Categorize"
              >
                <Sparkles size={20} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              {initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
