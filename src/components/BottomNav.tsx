import React from 'react';
import {
  Home,
  Wallet,
  QrCode,
  History,
  Gift,
  ArrowUpRight,
  User
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, setActiveModal, scratchCards } = useFlowPay();

  const unscratchedCount = scratchCards.filter(c => !c.isScratched).length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 md:hidden shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* Home */}
        <button
          type="button"
          onClick={() => setActiveView('consumer')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[11px] font-medium transition-colors ${
            activeView === 'consumer' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        {/* Wallet */}
        <button
          type="button"
          onClick={() => setActiveModal('add_wallet')}
          className="flex flex-col items-center justify-center w-14 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Wallet className="w-5 h-5 mb-0.5" />
          <span>Wallet</span>
        </button>

        {/* Center Floating Scan & Pay */}
        <div className="relative -top-5">
          <button
            type="button"
            onClick={() => setActiveModal('scan_pay')}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 ring-4 ring-white active:scale-95 transition-transform"
            title="Scan Any QR"
          >
            <QrCode className="w-6 h-6" />
          </button>
        </div>

        {/* History */}
        <button
          type="button"
          onClick={() => setActiveView('history')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[11px] font-medium transition-colors ${
            activeView === 'history' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-5 h-5 mb-0.5" />
          <span>History</span>
        </button>

        {/* Rewards */}
        <button
          type="button"
          onClick={() => setActiveView('rewards')}
          className={`relative flex flex-col items-center justify-center w-14 py-1 text-[11px] font-medium transition-colors ${
            activeView === 'rewards' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Gift className="w-5 h-5 mb-0.5" />
          <span>Rewards</span>
          {unscratchedCount > 0 && (
            <span className="absolute top-0 right-3 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
              {unscratchedCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
