import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Camera,
  Upload,
  Sparkles,
  Store,
  CheckCircle2,
  Lock,
  Volume2
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';

interface DemoQrItem {
  id: string;
  name: string;
  upiId: string;
  category: string;
  suggestedAmount: number;
  avatar: string;
}

const DEMO_QRS: DemoQrItem[] = [
  {
    id: 'demo_1',
    name: 'Metro Gourmet Mart & Cafe',
    upiId: 'metro.grocers@flowpay',
    category: 'Supermarket & Cafe',
    suggestedAmount: 320,
    avatar: '🛒'
  },
  {
    id: 'demo_2',
    name: 'Blue Tokai Coffee Roasters',
    upiId: 'bluetokai@okhdfcbank',
    category: 'Coffee & Bakery',
    suggestedAmount: 260,
    avatar: '☕'
  },
  {
    id: 'demo_3',
    name: 'Zara Lifestyle & Fashion',
    upiId: 'zara.india@icici',
    category: 'Clothing & Apparel',
    suggestedAmount: 1890,
    avatar: '🛍️'
  },
  {
    id: 'demo_4',
    name: 'Starbucks Coffee Reserve',
    upiId: 'starbucks@flowpay',
    category: 'Beverages',
    suggestedAmount: 450,
    avatar: '🥤'
  }
];

export const ScanPayModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { payViaQR, user } = useFlowPay();

  const [selectedMerchant, setSelectedMerchant] = useState<DemoQrItem | null>(DEMO_QRS[0]);
  const [customMerchantName, setCustomMerchantName] = useState('');
  const [customUpi, setCustomUpi] = useState('');
  const [amount, setAmount] = useState('320');
  const [note, setNote] = useState('Store purchase');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'demo' | 'camera' | 'upload'>('demo');
  const [scanLaserPos, setScanLaserPos] = useState(0);

  // Viewfinder laser animation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setScanLaserPos(prev => (prev >= 100 ? 0 : prev + 4));
    }, 40);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectDemoQr = (merchant: DemoQrItem) => {
    setSelectedMerchant(merchant);
    setCustomMerchantName(merchant.name);
    setCustomUpi(merchant.upiId);
    setAmount(merchant.suggestedAmount.toString());
  };

  const handleConfirmQrPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const name = selectedMerchant ? selectedMerchant.name : customMerchantName || 'Verified Merchant';
    const upi = selectedMerchant ? selectedMerchant.upiId : customUpi || 'merchant@flowpay';

    setIsProcessing(true);
    try {
      await payViaQR(name, upi, num, note);
      onClose();
    } catch {
      alert('Payment failed');
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
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Scan & Pay Any QR</h3>
              <p className="text-xs text-slate-500">Supports BharatQR, UPI QR, and FlowPay Soundbox</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('demo')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'demo' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Demo Merchants
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('camera')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'camera' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Camera Scanner
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'upload' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Upload QR Image
            </button>
          </div>
        </div>

        {/* Scanner Viewfinder or Demo Selection */}
        <div className="p-6 space-y-4">
          {activeTab === 'camera' && (
            <div className="relative w-full h-48 bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-slate-800">
              <div className="w-36 h-36 border-2 border-blue-500 rounded-xl relative flex items-center justify-center">
                {/* 4 Corner Markers */}
                <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                {/* Animated Laser */}
                <div
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-emerald-300 to-emerald-500 shadow-[0_0_10px_#10b981]"
                  style={{ top: `${scanLaserPos}%` }}
                />
                <Camera className="w-8 h-8 text-slate-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Align merchant QR inside square to scan</p>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-slate-50">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800">Click to upload QR code image</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Supports PNG, JPG, or Screenshots</div>
            </div>
          )}

          {/* Quick Demo QR Cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Demo Merchant QR Code</label>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_QRS.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectDemoQr(item)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    selectedMerchant?.id === item.id
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-xl">{item.avatar}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{item.category}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleConfirmQrPayment} className="space-y-4 pt-2 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Paying To</span>
                <div className="text-xs font-bold text-slate-900">{selectedMerchant?.name || customMerchantName}</div>
                <div className="text-[11px] font-mono text-slate-500">{selectedMerchant?.upiId || customUpi}</div>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified Merchant
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Enter Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-lg font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Description</label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Order reference / items"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-2 text-xs text-amber-800">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Guaranteed Cashback:</strong> You will unlock a scratch card & trigger the merchant's FlowPay Soundbox announcement!
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !amount}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-transform active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? 'Processing Payment...' : `Pay ₹${parseFloat(amount || '0').toLocaleString()} Instantly`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
