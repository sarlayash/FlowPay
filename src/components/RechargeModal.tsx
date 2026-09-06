import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Tv,
  Car,
  TrainTrack,
  CheckCircle2,
  Sparkles,
  Search,
  Radio,
  Clock,
  Zap
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';
import { RECHARGE_PROVIDERS } from '../data/mockData';
import { RechargePlan } from '../types';

export const RechargeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { payRecharge } = useFlowPay();

  const [rechargeType, setRechargeType] = useState<'mobile' | 'dth' | 'fastag' | 'metro'>('mobile');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [consumerId, setConsumerId] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(RECHARGE_PROVIDERS[0]);
  const [selectedPlan, setSelectedPlan] = useState<RechargePlan | null>(RECHARGE_PROVIDERS[0]?.plans?.[0] || null);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentProviders = RECHARGE_PROVIDERS.filter(p => p.type === rechargeType);

  const handleRechargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = selectedPlan ? selectedPlan.price : parseFloat(customAmount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert('Please select a plan or enter an amount');
      return;
    }

    setIsProcessing(true);
    try {
      await payRecharge({
        providerName: selectedProvider.name,
        rechargeType,
        targetIdentifier: rechargeType === 'mobile' ? phoneNumber : consumerId || 'KA01AB1234',
        amount: finalAmount,
        planDescription: selectedPlan ? `${selectedPlan.validity} • ${selectedPlan.data}` : 'Custom Recharge'
      });
      onClose();
    } catch {
      alert('Recharge failed');
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
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Recharge Center</h3>
              <p className="text-xs text-slate-500">Mobile, DTH, FASTag & Metro Smart Cards</p>
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

        {/* Category Tabs (PRD Module 6) */}
        <div className="px-6 pt-4 border-b border-slate-100 pb-3">
          <div className="grid grid-cols-4 gap-2">
            {[
              { type: 'mobile', label: 'Mobile', icon: Smartphone },
              { type: 'dth', label: 'DTH TV', icon: Tv },
              { type: 'fastag', label: 'FASTag', icon: Car },
              { type: 'metro', label: 'Metro Card', icon: TrainTrack }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.type}
                  type="button"
                  onClick={() => {
                    setRechargeType(tab.type as any);
                    const found = RECHARGE_PROVIDERS.find(p => p.type === tab.type);
                    if (found) {
                      setSelectedProvider(found);
                      setSelectedPlan(found.plans?.[0] || null);
                    }
                  }}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    rechargeType === tab.type
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Operator / Provider</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {currentProviders.map(prov => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => {
                    setSelectedProvider(prov);
                    setSelectedPlan(prov.plans?.[0] || null);
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-all ${
                    selectedProvider.id === prov.id
                      ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold ring-2 ring-amber-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                    {prov.name[0]}
                  </div>
                  <span className="truncate">{prov.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Identifier Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {rechargeType === 'mobile'
                ? 'Mobile Number'
                : rechargeType === 'dth'
                ? 'Subscriber ID / Smartcard No.'
                : rechargeType === 'fastag'
                ? 'Vehicle Registration Number'
                : 'Metro Smart Card ID'}
            </label>
            <div className="relative">
              {rechargeType === 'mobile' ? (
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={consumerId}
                  onChange={e => setConsumerId(e.target.value)}
                  placeholder={
                    rechargeType === 'dth'
                      ? 'e.g. 1029384756'
                      : rechargeType === 'fastag'
                      ? 'e.g. MH02DW8992'
                      : 'e.g. 0918237465'
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                />
              )}
            </div>
          </div>

          {/* If Mobile, show available plans catalog */}
          {selectedProvider.plans && selectedProvider.plans.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">Recommended Packs & Plans</label>
                <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" /> Unlimited 5G Included
                </span>
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {selectedProvider.plans.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan);
                      setCustomAmount('');
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedPlan?.id === plan.id
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-slate-900">₹{plan.price}</span>
                          {plan.tag && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900">
                              {plan.tag}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-medium text-slate-700 mt-0.5">
                          Validity: <span className="font-bold">{plan.validity}</span> • Data: <span className="font-bold">{plan.data}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-emerald-600">{plan.voice}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{plan.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Recharge Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-base font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={e => {
                    setCustomAmount(e.target.value);
                    setSelectedPlan(null);
                  }}
                  placeholder="e.g. 500"
                  className="w-full pl-8 pr-4 py-2.5 text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                {[100, 200, 500, 1000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setCustomAmount(val.toString());
                      setSelectedPlan(null);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                  >
                    ₹{val}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reward Prompt */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-xs text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>10% FlowCoins Cash Return:</strong> You will earn FlowCoins instantly credited to your wallet vault!
            </span>
          </div>

          <button
            type="button"
            onClick={handleRechargeSubmit}
            disabled={isProcessing || (!selectedPlan && !customAmount)}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-transform active:scale-98 disabled:opacity-50"
          >
            {isProcessing ? 'Processing Recharge...' : `Recharge for ₹${selectedPlan ? selectedPlan.price : customAmount || '0'}`}
          </button>
        </div>
      </div>
    </div>
  );
};
