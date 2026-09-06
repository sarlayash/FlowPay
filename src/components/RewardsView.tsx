import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Gift,
  Sparkles,
  Coins,
  CheckCircle2,
  Copy,
  ArrowRight,
  TrendingUp,
  Tag,
  Star,
  Award
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';
import { ScratchCard } from '../types';

export const RewardsView: React.FC = () => {
  const { scratchCards, scratchCard, user, redeemFlowCoins } = useFlowPay();

  const [activeCardToScratch, setActiveCardToScratch] = useState<ScratchCard | null>(null);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const unscratched = scratchCards.filter(c => !c.isScratched);
  const scratched = scratchCards.filter(c => c.isScratched);

  const handleStartScratching = (card: ScratchCard) => {
    setActiveCardToScratch(card);
    setScratchProgress(0);
  };

  const handleReveal = async (card: ScratchCard) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    await scratchCard(card.id);
    setActiveCardToScratch(null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Top Banner: Rewards Vault */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/15 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-100 text-xs font-bold uppercase tracking-wider">
                FlowPay Rewards & Gamification Vault
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                🪙 {user.flowCoins.toLocaleString()}
              </span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">
                FlowCoins Balance
              </span>
            </div>
            <p className="text-xs text-amber-100 mt-2 max-w-md">
              Earn FlowCoins on every scan, bill, and recharge. Redeem for real wallet cash or premium brand vouchers!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => redeemFlowCoins(250)}
              disabled={user.flowCoins < 250}
              className="px-4 py-2.5 rounded-xl bg-white text-orange-700 hover:bg-orange-50 text-xs font-bold shadow-sm disabled:opacity-50 transition-transform active:scale-95"
            >
              Redeem 250 Coins for ₹25 Cash
            </button>
            <button
              type="button"
              onClick={() => redeemFlowCoins(500)}
              disabled={user.flowCoins < 500}
              className="px-4 py-2.5 rounded-xl bg-orange-600/40 hover:bg-orange-600/60 border border-white/30 text-white text-xs font-bold shadow-sm disabled:opacity-50 transition-transform active:scale-95"
            >
              Redeem 500 Coins for ₹50 Cash
            </button>
          </div>
        </div>
      </div>

      {/* Unclaimed Scratch Cards Section (PRD Module 8) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Unscratched Reward Cards ({unscratched.length})</span>
            </h3>
            <p className="text-xs text-slate-500">Scratch to reveal guaranteed cashback and FlowCoins</p>
          </div>
        </div>

        {unscratched.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Gift className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-700">All caught up! No unscratched cards.</div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Make a QR payment, pay a utility bill, or recharge to unlock new scratch cards!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {unscratched.map(card => (
              <div
                key={card.id}
                onClick={() => handleStartScratching(card)}
                className="cursor-pointer group relative aspect-square rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                {/* Holographic Scratch Pattern */}
                <div className="w-full h-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex flex-col items-center justify-center p-4 text-center text-white relative">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2 shadow-inner group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wide">FlowPay Reward</span>
                  <span className="text-[10px] text-amber-100 mt-1">Tap to Scratch</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Scratch Modal Overlay */}
      {activeCardToScratch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-5 shadow-2xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Reward Card Unlocked
              </span>
              <h4 className="text-lg font-extrabold text-slate-900 mt-1">Scratch to Claim!</h4>
              <p className="text-xs text-slate-500">Tap the card or click reveal to unlock your prize</p>
            </div>

            {/* Simulated Scratch Surface */}
            <div
              onClick={() => handleReveal(activeCardToScratch)}
              className="relative w-64 h-64 mx-auto rounded-3xl cursor-pointer overflow-hidden border-4 border-amber-400 shadow-xl flex flex-col items-center justify-center group"
            >
              {/* Revealed prize background underneath */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex flex-col items-center justify-center p-4">
                <span className="text-4xl mb-2">🎉</span>
                <span className="text-2xl font-extrabold">
                  {activeCardToScratch.rewardType === 'cashback'
                    ? `₹${activeCardToScratch.amount}`
                    : `🪙 ${activeCardToScratch.coins} Coins`}
                </span>
                <span className="text-xs text-emerald-100 mt-1">{activeCardToScratch.description}</span>
              </div>

              {/* Scratch Mask overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex flex-col items-center justify-center text-white p-4 transition-all duration-300 group-hover:scale-98">
                <Sparkles className="w-12 h-12 mb-2 animate-bounce" />
                <span className="text-base font-extrabold tracking-wider">TAP TO SCRATCH</span>
                <span className="text-[11px] text-amber-100 mt-1">Guaranteed Win Inside</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveCardToScratch(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReveal(activeCardToScratch)}
                className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25"
              >
                Instant Reveal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Partner Coupons & Offers (PRD Module 8) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Exclusive Partner Coupon Codes</h3>
          <p className="text-xs text-slate-500">Instant discounts available exclusively for FlowPay users</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              brand: 'Zomato Dining & Delivery',
              offer: 'Flat ₹120 OFF on orders above ₹299',
              code: 'FLOWZOM120',
              tag: 'Food & Dining',
              bg: 'bg-rose-50 border-rose-200'
            },
            {
              brand: 'Swiggy Instamart',
              offer: 'Free delivery + ₹75 OFF on groceries',
              code: 'FLOWMART75',
              tag: 'Groceries',
              bg: 'bg-orange-50 border-orange-200'
            },
            {
              brand: 'Uber Premier & Go',
              offer: '20% OFF on next 3 airport rides',
              code: 'FLOWUBER20',
              tag: 'Travel & Commute',
              bg: 'bg-slate-100 border-slate-300'
            },
            {
              brand: 'BookMyShow',
              offer: 'Buy 1 Get 1 on IMAX movie tickets',
              code: 'FLOWCINEMA',
              tag: 'Entertainment',
              bg: 'bg-indigo-50 border-indigo-200'
            },
            {
              brand: 'MakeMyTrip Flights',
              offer: 'Flat ₹1,500 OFF on domestic round trips',
              code: 'FLOWFLY',
              tag: 'Holidays',
              bg: 'bg-blue-50 border-blue-200'
            },
            {
              brand: 'Myntra Fashion',
              offer: 'Extra 15% OFF on top brand apparel',
              code: 'FLOWFASHION',
              tag: 'Shopping',
              bg: 'bg-pink-50 border-pink-200'
            }
          ].map((deal, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border ${deal.bg} flex flex-col justify-between space-y-3`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{deal.tag}</span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">{deal.brand}</h4>
                <p className="text-xs text-slate-600 mt-1">{deal.offer}</p>
              </div>

              <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-slate-200/80">
                <span className="font-mono text-xs font-bold text-blue-700">{deal.code}</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(deal.code)}
                  className="text-slate-500 hover:text-blue-600 text-xs font-semibold flex items-center gap-1"
                >
                  {copiedCode === deal.code ? (
                    <span className="text-emerald-600 text-[11px] font-bold">Copied!</span>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
