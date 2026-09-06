import React, { useState } from 'react';
import {
  X,
  Tag,
  Gift,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Film,
  Music,
  Gamepad2,
  Copy
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';
import { GIFT_CARDS } from '../data/mockData';
import { GiftCardBrand } from '../types';

export const GiftCardsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, sendMoney } = useFlowPay();

  const [selectedBrand, setSelectedBrand] = useState<GiftCardBrand>(GIFT_CARDS[0]);
  const [selectedDenomination, setSelectedDenomination] = useState<number>(GIFT_CARDS[0].denominations[1] || 500);
  const [recipientEmail, setRecipientEmail] = useState(user.email);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchasedCode, setPurchasedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      await sendMoney({
        recipientName: `${selectedBrand.name} Purchase`,
        amount: selectedDenomination,
        paymentMethod: 'FlowPay Wallet',
        note: `Gift card generated for ${recipientEmail}`
      });

      const randomCode = `FP-${selectedBrand.logoText.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      setPurchasedCode(randomCode);
    } catch {
      alert('Purchase failed');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Brand Gift Cards & Vouchers</h3>
              <p className="text-xs text-slate-500">Instant code delivery with extra FlowCoins cashback</p>
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

        {purchasedCode ? (
          /* Purchase Success View */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Gift Card Generated!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your ₹{selectedDenomination} {selectedBrand.name} voucher is ready to use.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-slate-900">{purchasedCode}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(purchasedCode);
                  alert('Voucher code copied to clipboard!');
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-blue-700"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setPurchasedCode(null);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
            >
              Done
            </button>
          </div>
        ) : (
          /* Brand Picker & Denomination */
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Brands Grid (PRD Module 8) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Select Brand</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GIFT_CARDS.map(brand => (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => {
                      setSelectedBrand(brand);
                      setSelectedDenomination(brand.denominations[0]);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedBrand.id === brand.id
                        ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{brand.name}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-100/70 px-1.5 py-0.2 rounded mt-1 inline-block">
                      {brand.cashbackOffer}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Denominations */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Select Denomination (₹)</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {selectedBrand.denominations.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSelectedDenomination(val)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedDenomination === val
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deliver Code to Email</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={e => setRecipientEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            {/* Summary Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Voucher Value</span>
                <span className="font-bold text-slate-900">₹{selectedDenomination}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Instant Cashback</span>
                <span className="font-bold">-₹{Math.floor(selectedDenomination * (selectedBrand.discountPercentage / 100))}</span>
              </div>
              <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900">
                <span>Total Payable</span>
                <span>₹{selectedDenomination - Math.floor(selectedDenomination * (selectedBrand.discountPercentage / 100))}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePurchase}
              disabled={isPurchasing}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-500/25 transition-transform active:scale-98 disabled:opacity-50"
            >
              {isPurchasing ? 'Generating Voucher...' : `Buy ${selectedBrand.name} Voucher`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
