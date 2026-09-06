import React, { useState } from 'react';
import {
  X,
  Zap,
  Droplet,
  Flame,
  Wifi,
  PhoneCall,
  GraduationCap,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';
import { BILL_PROVIDERS } from '../data/mockData';
import { BillProvider } from '../types';

export const BillsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { payBill } = useFlowPay();

  const [selectedCategory, setSelectedCategory] = useState<string>('electricity');
  const [selectedProvider, setSelectedProvider] = useState<BillProvider>(BILL_PROVIDERS[0]);
  const [consumerNumber, setConsumerNumber] = useState('901824729102');
  const [amount, setAmount] = useState<string>('1840');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'electricity', label: 'Electricity', icon: Zap, color: '#F59E0B' },
    { id: 'gas', label: 'Piped Gas', icon: Flame, color: '#EA580C' },
    { id: 'water', label: 'Water Board', icon: Droplet, color: '#0284C7' },
    { id: 'broadband', label: 'Broadband', icon: Wifi, color: '#DC2626' },
    { id: 'landline', label: 'Landline', icon: PhoneCall, color: '#4F46E5' },
    { id: 'education', label: 'Education', icon: GraduationCap, color: '#059669' },
    { id: 'insurance', label: 'Insurance', icon: ShieldCheck, color: '#0D9488' },
    { id: 'municipal', label: 'Property Tax', icon: Building2, color: '#6366F1' }
  ];

  const filteredProviders = BILL_PROVIDERS.filter(p => p.category === selectedCategory);

  const handlePayBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      alert('Enter a valid amount');
      return;
    }

    setIsProcessing(true);
    try {
      await payBill({
        providerName: selectedProvider.name,
        category: selectedCategory,
        consumerNumber,
        amount: num
      });
      onClose();
    } catch {
      alert('Bill payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Utility Bill Payments</h3>
              <p className="text-xs text-slate-500">BBPS Integrated • Electricity, Gas, Water & Municipal Taxes</p>
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

        {/* Categories Bar */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    const prov = BILL_PROVIDERS.find(p => p.category === cat.id);
                    if (prov) {
                      setSelectedProvider(prov);
                      setAmount(prov.billDueAmount?.toString() || '750');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handlePayBill} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Biller / Provider</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredProviders.map(prov => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => {
                    setSelectedProvider(prov);
                    if (prov.billDueAmount) setAmount(prov.billDueAmount.toString());
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedProvider.id === prov.id
                      ? 'border-cyan-600 bg-cyan-50/70 text-cyan-950 font-bold ring-2 ring-cyan-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{prov.name}</div>
                    <div className="text-[10px] text-slate-500">BBPS Certified Biller</div>
                  </div>
                  {prov.billDueAmount && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Due: ₹{prov.billDueAmount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Consumer Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {selectedProvider.sampleAccountPrompt || 'Consumer / Account Number'}
            </label>
            <input
              type="text"
              value={consumerNumber}
              onChange={e => setConsumerNumber(e.target.value)}
              placeholder="e.g. 100293847"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-900"
            />
          </div>

          {/* Bill Due Details Card */}
          {selectedProvider.billDueAmount && (
            <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="text-xs font-bold text-amber-950">Active Bill Found</div>
                  <div className="text-[11px] text-amber-800">Due Date: {selectedProvider.dueDate || 'In 5 days'}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-amber-950">₹{selectedProvider.billDueAmount}</span>
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Amount to Pay (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-lg font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="1000"
                className="w-full pl-9 pr-4 py-3 text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-900"
              />
            </div>
          </div>

          {/* Guaranteed Reward banner */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Guaranteed ₹25 to ₹75 Scratch Card Cashback</strong> will be awarded upon payment completion!
            </span>
          </div>

          <button
            type="submit"
            disabled={isProcessing || !amount}
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm shadow-md shadow-cyan-500/20 transition-transform active:scale-98 disabled:opacity-50"
          >
            {isProcessing ? 'Paying Bill...' : `Pay ₹${parseFloat(amount || '0').toLocaleString()} via FlowPay`}
          </button>
        </form>
      </div>
    </div>
  );
};
