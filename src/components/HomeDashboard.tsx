import React from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Smartphone,
  Zap,
  Split,
  Gift,
  Plus,
  Eye,
  EyeOff,
  ChevronRight,
  Sparkles,
  TrendingUp,
  CreditCard,
  Building2,
  Receipt,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';
import { Transaction } from '../types';

export const HomeDashboard: React.FC = () => {
  const {
    user,
    contacts,
    transactions,
    isBalanceVisible,
    setIsBalanceVisible,
    setActiveModal,
    setActiveView,
    setSelectedTransaction,
    setIsAiDrawerOpen,
    scratchCards
  } = useFlowPay();

  const unscratchedCards = scratchCards.filter(c => !c.isScratched);
  const recentTransactions = transactions.slice(0, 5);
  const spendPercentage = Math.min(100, Math.round((user.currentMonthSpend / user.monthlySpendLimit) * 100));

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Top Banner: PRD Demo Highlight Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-4 sm:p-6 text-white shadow-lg shadow-blue-600/15 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-200 text-xs font-semibold tracking-wide uppercase">
                FlowPay Wallet & UPI Balance
              </span>
              <button
                type="button"
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="text-blue-200 hover:text-white transition-colors"
                title="Toggle balance visibility"
              >
                {isBalanceVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {isBalanceVisible ? `₹${user.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '••••••••'}
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Active & Insured
              </span>
            </div>

            <p className="text-xs text-blue-100/80 mt-1">
              Primary UPI ID: <span className="font-mono text-white font-medium">{user.upiId}</span> • Linked to {user.linkedAccounts[0]?.bankName}
            </p>
          </div>

          {/* Quick Wallet Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveModal('add_wallet')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold shadow-sm transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Money</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('withdraw')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 text-white border border-blue-300/30 text-xs font-bold transition-transform active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw to Bank</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('my_qr')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-300/20 text-xs font-semibold"
              title="Show my QR Code"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">My QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Quick Actions Grid (PRD Module 2) */}
      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setActiveModal('scan_pay')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-blue-50/60 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all text-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <QrCode className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-slate-800">Scan & Pay</span>
          <span className="text-[10px] text-slate-400">Any QR</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('transfer')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-blue-50/60 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all text-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-slate-800">To Mobile</span>
          <span className="text-[10px] text-slate-400">UPI / Contact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('transfer_bank')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-blue-50/60 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all text-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-slate-800">To Bank A/c</span>
          <span className="text-[10px] text-slate-400">Self / Other</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('split_bill')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-blue-50/60 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all text-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Split className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-slate-800">Split Bill</span>
          <span className="text-[10px] text-slate-400">With Friends</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('recharge')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-blue-50/60 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all text-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Smartphone className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-slate-800">Recharge</span>
          <span className="text-[10px] text-slate-400">Mobile & DTH</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('bills')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-blue-50/60 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all text-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-slate-800">Pay Bills</span>
          <span className="text-[10px] text-slate-400">Power & Water</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('gift_cards')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-blue-50/60 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all text-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Tag className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-slate-800">Gift Cards</span>
          <span className="text-[10px] text-slate-400">Amazon & more</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('rewards')}
          className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-blue-50/60 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all text-center group"
        >
          {unscratchedCards.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs animate-bounce">
              {unscratchedCards.length} New
            </span>
          )}
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Gift className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-slate-800">Rewards</span>
          <span className="text-[10px] text-slate-400">{user.flowCoins} Coins</span>
        </button>
      </div>

      {/* Row: Quick Send to Contacts + Spending Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Favorites & Recent Contacts */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Send Again / Frequent Contacts</h3>
              <p className="text-xs text-slate-500">1-tap instant transfer to verified UPI IDs</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('transfer')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {/* Quick Add Contact Button */}
            <button
              type="button"
              onClick={() => setActiveModal('transfer')}
              className="flex flex-col items-center gap-1.5 min-w-[68px] group"
            >
              <div className="w-13 h-13 rounded-full border-2 border-dashed border-slate-300 hover:border-blue-500 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-600">New Pay</span>
            </button>

            {contacts.map(contact => (
              <button
                key={contact.id}
                type="button"
                onClick={() => {
                  setActiveModal('transfer');
                }}
                className="flex flex-col items-center gap-1.5 min-w-[68px] group text-center"
              >
                <div className="relative">
                  <img
                    src={contact.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`}
                    alt={contact.name}
                    className="w-13 h-13 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500 transition-all"
                  />
                  {contact.isFavorite && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                      ★
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-slate-800 max-w-[68px] truncate">
                  {contact.name.split(' ')[0]}
                </span>
                <span className="text-[9px] text-slate-400 -mt-1">{contact.recentTimestamp || 'Recent'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Col: Smart Spending Meter (PRD Daily & Monthly Spending) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Monthly Spending Meter</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAiDrawerOpen(true)}
                className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
              >
                <Sparkles className="w-3 h-3 text-amber-500" /> AI Insights
              </button>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xl font-extrabold text-slate-900">
                  ₹{user.currentMonthSpend.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  of ₹{user.monthlySpendLimit.toLocaleString()} limit
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    spendPercentage > 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                  }`}
                  style={{ width: `${spendPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>{spendPercentage}% utilized</span>
                <span className="text-emerald-600 font-semibold">
                  ₹{(user.monthlySpendLimit - user.currentMonthSpend).toLocaleString()} safe buffer
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">FlowCoins Reward Vault</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              🪙 {user.flowCoins.toLocaleString()} Coins
            </span>
          </div>
        </div>
      </div>

      {/* Offers & Cashback Strip (PRD Module 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => setActiveView('rewards')}
          className="cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-white shadow-xs relative overflow-hidden group"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                Weekend Flash Deal
              </span>
              <h4 className="text-base font-bold mt-1">Flat ₹75 Cashback on Utility Bills</h4>
              <p className="text-xs text-amber-100">Pay electricity, gas, or water bill above ₹500.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setActiveModal('recharge')}
          className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white shadow-xs relative overflow-hidden group"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                5G Recharge Carnival
              </span>
              <h4 className="text-base font-bold mt-1">Get 10% Extra FlowCoins</h4>
              <p className="text-xs text-blue-100">On all quarterly & annual Jio/Airtel plans.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions List (PRD Module 2 & 10) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Live payment settlements and transfers</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('history')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Full Statement</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentTransactions.map((tx: Transaction) => (
            <div
              key={tx.id}
              onClick={() => {
                setSelectedTransaction(tx);
                setActiveModal('receipt');
              }}
              className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
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
                    <span className="text-xs font-bold text-slate-900">{tx.title}</span>
                    {tx.hasScratchCard && !tx.scratchCardId && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded font-semibold">
                        Reward Unlocked
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span>{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span>{tx.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-xs font-bold ${
                    tx.direction === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {tx.direction === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Success</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
