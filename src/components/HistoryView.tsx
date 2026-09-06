import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Smartphone,
  Zap,
  CheckCircle2,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';
import { Transaction } from '../types';

export const HistoryView: React.FC = () => {
  const { transactions, setSelectedTransaction, setActiveModal } = useFlowPay();

  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const filteredTransactions = transactions.filter(tx => {
    // Type filtering
    if (filterType === 'sent' && tx.direction !== 'debit') return false;
    if (filterType === 'received' && tx.direction !== 'credit') return false;
    if (filterType === 'bills' && tx.type !== 'bill_pay') return false;
    if (filterType === 'recharge' && tx.type !== 'recharge') return false;

    // Search query
    if (
      searchQuery &&
      !tx.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !tx.counterpartyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !tx.referenceId.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const handleExportCSV = () => {
    window.open('/api/transactions/export?format=csv', '_blank');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Transaction History & Passbook</h2>
          <p className="text-xs text-slate-500">Live verified statements, receipts, and tax records</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar (PRD Module 10) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by merchant, friend, or reference ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'sent', label: 'Money Sent' },
              { id: 'received', label: 'Received' },
              { id: 'bills', label: 'Bills' },
              { id: 'recharge', label: 'Recharges' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Showing {filteredTransactions.length} Transactions
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No transactions match your search filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((tx: Transaction) => (
              <div
                key={tx.id}
                onClick={() => {
                  setSelectedTransaction(tx);
                  setActiveModal('receipt');
                }}
                className="py-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                      tx.direction === 'credit'
                        ? 'bg-emerald-50 text-emerald-600'
                        : tx.type === 'qr_pay'
                        ? 'bg-blue-50 text-blue-600'
                        : tx.type === 'recharge'
                        ? 'bg-amber-50 text-amber-600'
                        : tx.type === 'bill_pay'
                        ? 'bg-cyan-50 text-cyan-600'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tx.direction === 'credit' ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : tx.type === 'qr_pay' ? (
                      <QrCode className="w-5 h-5" />
                    ) : tx.type === 'recharge' ? (
                      <Smartphone className="w-5 h-5" />
                    ) : tx.type === 'bill_pay' ? (
                      <Zap className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{tx.title}</span>
                      {tx.cashbackEarned ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          +₹{tx.cashbackEarned} Cashback
                        </span>
                      ) : null}
                    </div>

                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>
                        {new Date(tx.timestamp).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span>•</span>
                      <span>{tx.paymentMethod}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-slate-500">{tx.referenceId}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-sm font-extrabold ${
                      tx.direction === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {tx.direction === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
