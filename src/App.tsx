import React from 'react';
import { FlowPayProvider, useFlowPay } from './context/FlowPayContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { HistoryView } from './components/HistoryView';
import { RewardsView } from './components/RewardsView';
import { MerchantView } from './components/MerchantView';
import { AdminView } from './components/AdminView';
import { TransferModal } from './components/TransferModal';
import { ScanPayModal } from './components/ScanPayModal';
import { MyQRModal } from './components/MyQRModal';
import { WalletModal } from './components/WalletModal';
import { RechargeModal } from './components/RechargeModal';
import { BillsModal } from './components/BillsModal';
import { GiftCardsModal } from './components/GiftCardsModal';
import { SplitBillModal } from './components/SplitBillModal';
import { ReceiptModal } from './components/ReceiptModal';
import { AiFinanceAssistant } from './components/AiFinanceAssistant';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const FlowPayApp: React.FC = () => {
  const {
    activeView,
    activeModal,
    setActiveModal,
    selectedTransaction,
    notifications,
    clearNotification
  } = useFlowPay();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'consumer' && <HomeDashboard />}
        {activeView === 'history' && <HistoryView />}
        {activeView === 'rewards' && <RewardsView />}
        {activeView === 'merchant' && <MerchantView />}
        {activeView === 'admin' && <AdminView />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Interactive Modals */}
      <TransferModal
        isOpen={activeModal === 'transfer' || activeModal === 'transfer_bank'}
        onClose={() => setActiveModal(null)}
      />
      <ScanPayModal
        isOpen={activeModal === 'scan_pay'}
        onClose={() => setActiveModal(null)}
      />
      <MyQRModal
        isOpen={activeModal === 'my_qr'}
        onClose={() => setActiveModal(null)}
      />
      <WalletModal
        isOpen={activeModal === 'add_wallet' || activeModal === 'withdraw'}
        onClose={() => setActiveModal(null)}
      />
      <RechargeModal
        isOpen={activeModal === 'recharge'}
        onClose={() => setActiveModal(null)}
      />
      <BillsModal
        isOpen={activeModal === 'bills'}
        onClose={() => setActiveModal(null)}
      />
      <GiftCardsModal
        isOpen={activeModal === 'gift_cards'}
        onClose={() => setActiveModal(null)}
      />
      <SplitBillModal
        isOpen={activeModal === 'split_bill'}
        onClose={() => setActiveModal(null)}
      />
      <ReceiptModal
        isOpen={activeModal === 'receipt'}
        onClose={() => setActiveModal(null)}
        transaction={selectedTransaction}
      />

      {/* AI Finance Assistant Drawer */}
      <AiFinanceAssistant />

      {/* Global In-App Notifications Toast */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {notifications.slice(0, 3).map(n => (
          <div
            key={n.id}
            className="pointer-events-auto bg-white border border-slate-200/90 shadow-lg rounded-2xl p-3.5 flex items-start gap-3 animate-in slide-in-from-top-3 duration-200"
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                n.type === 'success'
                  ? 'bg-emerald-50 text-emerald-600'
                  : n.type === 'warning'
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-blue-50 text-blue-600'
              }`}
            >
              {n.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : n.type === 'warning' ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Info className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900">{n.title}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{n.message}</div>
            </div>
            <button
              type="button"
              onClick={() => clearNotification(n.id)}
              className="text-slate-400 hover:text-slate-700 text-xs ml-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <FlowPayProvider>
      <FlowPayApp />
    </FlowPayProvider>
  );
}
