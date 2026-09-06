import React, { useState } from 'react';
import {
  X,
  Wallet,
  Plus,
  ArrowUpRight,
  CreditCard,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Download
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';

export const WalletModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, addMoneyToWallet, withdrawToBank } = useFlowPay();

  const [activeTab, setActiveTab] = useState<'add' | 'withdraw' | 'linked'>('add');
  const [amount, setAmount] = useState('1000');
  const [selectedSource, setSelectedSource] = useState('HDFC Bank ••4821');
  const [selectedWithdrawBank, setSelectedWithdrawBank] = useState('HDFC Bank ••4821');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      alert('Enter a valid amount');
      return;
    }
    setIsProcessing(true);
    try {
      await addMoneyToWallet(num, selectedSource);
      onClose();
    } catch {
      alert('Failed to add money');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      alert('Enter a valid amount');
      return;
    }
    if (num > user.walletBalance) {
      alert('Insufficient wallet balance');
      return;
    }
    setIsProcessing(true);
    try {
      await withdrawToBank(num, selectedWithdrawBank);
      onClose();
    } catch {
      alert('Failed to withdraw');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Wallet Management</h3>
              <p className="text-xs text-slate-500">Add funds, withdraw, and manage linked banks</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Ribbon */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-blue-200">Current Wallet Balance</span>
            <div className="text-2xl font-extrabold">₹{user.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </div>
          <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-medium">
            ID: {user.walletId}
          </span>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('add')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'add' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Add Money
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('withdraw')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'withdraw' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Withdraw to Bank
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('linked')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'linked' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Linked Banks ({user.linkedAccounts.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'add' && (
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Enter Amount to Add</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-lg font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="500"
                    className="w-full pl-9 pr-4 py-3 text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                  />
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 mt-2">
                  {[500, 1000, 2000, 5000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                <div className="space-y-2">
                  {['HDFC Bank ••4821 (Net Banking)', 'ICICI Bank ••9023 (Instant UPI)', 'Debit / Credit Card (Visa/Mastercard)'].map(
                    method => (
                      <label
                        key={method}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedSource === method
                            ? 'border-blue-600 bg-blue-50/60 font-semibold text-blue-950 ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span className="text-xs">{method}</span>
                        </div>
                        <input
                          type="radio"
                          name="source"
                          checked={selectedSource === method}
                          onChange={() => setSelectedSource(method)}
                          className="accent-blue-600"
                        />
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero convenience fees. 100% RBI compliant wallet.</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !amount}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-transform active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? 'Adding Money...' : `Add ₹${parseFloat(amount || '0').toLocaleString()} to Wallet`}
              </button>
            </form>
          )}

          {activeTab === 'withdraw' && (
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Withdrawal Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-lg font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full pl-9 pr-4 py-3 text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Available: ₹{user.walletBalance.toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => setAmount(user.walletBalance.toString())}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Withdraw All
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Destination Bank Account</label>
                <div className="space-y-2">
                  {user.linkedAccounts.map(acc => (
                    <label
                      key={acc.id}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedWithdrawBank.includes(acc.bankName)
                          ? 'border-blue-600 bg-blue-50/60 font-semibold text-blue-950 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{acc.bankName} ({acc.accountNumberMasked})</div>
                        <div className="text-[11px] text-slate-500">IFSC: {acc.ifsc} • {acc.accountType} A/c</div>
                      </div>
                      <input
                        type="radio"
                        name="withdrawBank"
                        checked={selectedWithdrawBank.includes(acc.bankName)}
                        onChange={() => setSelectedWithdrawBank(`${acc.bankName} ${acc.accountNumberMasked}`)}
                        className="accent-blue-600"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                ⚡ <strong>Instant IMPS Settlement:</strong> Transferred directly to your savings account in under 3 seconds with zero deduction.
              </div>

              <button
                type="submit"
                disabled={isProcessing || !amount || parseFloat(amount) > user.walletBalance}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-transform active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? 'Transferring...' : `Withdraw ₹${parseFloat(amount || '0').toLocaleString()} to Bank`}
              </button>
            </form>
          )}

          {activeTab === 'linked' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {user.linkedAccounts.map(acc => (
                  <div
                    key={acc.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-blue-700">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{acc.bankName}</span>
                          {acc.isDefault && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {acc.accountNumberMasked} • {acc.upiId}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Linked
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => alert('Demo Bank Linking: HDFC Bank and ICICI Bank accounts are currently active.')}
                className="w-full py-2.5 rounded-xl border border-dashed border-blue-400 hover:bg-blue-50/50 text-blue-700 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Link Another Bank Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
