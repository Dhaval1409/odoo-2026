'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/app/components/AppShell';

// Mock structural data for rendering from your view layout instance
interface ExpenseLog {
  id: string;
  vehicleAsset: string;
  category: string;
  amountOutlay: number;
  settlementDate: string;
}

const MOCK_EXPENSES: ExpenseLog[] = [
  { id: '1', vehicleAsset: 'GJ01CD5678', category: 'Toll', amountOutlay: 620, settlementDate: 'Jul 9, 2026' },
  { id: '2', vehicleAsset: 'MH14IJ7890', category: 'Parking', amountOutlay: 200, settlementDate: 'Jul 2, 2026' },
  { id: '3', vehicleAsset: 'GJ01AB1234', category: 'Toll', amountOutlay: 850, settlementDate: 'Jul 1, 2026' },
  { id: '4', vehicleAsset: 'GJ05EF9012', category: 'Rto Fine', amountOutlay: 1500, settlementDate: 'Jun 28, 2026' },
  { id: '5', vehicleAsset: 'MH12GH3456', category: 'Insurance Premium', amountOutlay: 12500, settlementDate: 'Jun 15, 2026' },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating loading callback register
    setExpenses(MOCK_EXPENSES);
    setLoading(false);
  }, []);

  return (
    <AppShell>
      {/* Module Title Section Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-900 pb-5 gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400">06 — Operational Ledger</p>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">Expense Management</h1>
        </div>
        <button className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md dark:shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:opacity-95 transition-all">
          + Record Expense
        </button>
      </div>

      {/* Master Ledger Grid Card Container */}
      <div className="border border-slate-200 dark:border-slate-900 shadow-xl dark:shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-[#070d19]/40 backdrop-blur-md">
        {loading ? (
          <div className="p-8 text-center font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Syncing Ledger Entries...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-900 bg-slate-100/60 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="p-4 font-medium">Vehicle Asset</th>
                  <th className="p-4 font-medium">Expense Category</th>
                  <th className="p-4 font-medium">Amount Outlay</th>
                  <th className="p-4 font-medium">Settlement Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900/40 text-slate-700 dark:text-slate-300">
                {expenses.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="p-4 font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                      {log.vehicleAsset}
                    </td>
                    <td className="p-4">
                      <span className="inline-block text-xs font-mono font-semibold bg-slate-900 dark:bg-slate-950 border border-slate-800 text-slate-100 dark:text-slate-300 px-2.5 py-1 rounded-lg shadow-sm">
                        {log.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
                      ₹{log.amountOutlay.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {log.settlementDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}