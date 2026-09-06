import React from 'react';
import {
  X,
  CheckCircle2,
  Download,
  Share2,
  Copy,
  Receipt,
  Building2,
  ShieldCheck,
  Calendar,
  Clock
} from 'lucide-react';
import { Transaction } from '../types';

export const ReceiptModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}> = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transaction.referenceId);
    alert('Reference ID copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Payment Receipt</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge & Amount */}
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mt-2">
              Payment Successful
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              ₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{transaction.title}</p>
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 divide-y divide-slate-200 text-xs space-y-2.5">
            <div className="flex justify-between pt-1 text-slate-600">
              <span>Reference Number</span>
              <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                <span>{transaction.referenceId}</span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="text-blue-600 hover:text-blue-800 p-0.5"
                  title="Copy Reference"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-2 text-slate-600">
              <span>Date & Time</span>
              <span className="font-semibold text-slate-900">
                {new Date(transaction.timestamp).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <div className="flex justify-between pt-2 text-slate-600">
              <span>Paid To</span>
              <span className="font-semibold text-slate-900">{transaction.counterpartyName}</span>
            </div>

            {transaction.counterpartyUpi && (
              <div className="flex justify-between pt-2 text-slate-600">
                <span>Payee UPI ID</span>
                <span className="font-mono font-semibold text-slate-900">{transaction.counterpartyUpi}</span>
              </div>
            )}

            <div className="flex justify-between pt-2 text-slate-600">
              <span>Payment Mode</span>
              <span className="font-semibold text-slate-900">{transaction.paymentMethod}</span>
            </div>

            {transaction.cashbackEarned ? (
              <div className="flex justify-between pt-2 text-emerald-600 font-semibold">
                <span>Cashback Rewarded</span>
                <span>+₹{transaction.cashbackEarned}</span>
              </div>
            ) : null}

            {transaction.note && (
              <div className="flex justify-between pt-2 text-slate-600">
                <span>Note</span>
                <span className="italic text-slate-800">{transaction.note}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secured with 256-bit encryption by FlowPay</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `FlowPay Receipt - ₹${transaction.amount}`,
                    text: `Payment of ₹${transaction.amount} to ${transaction.counterpartyName} (Ref: ${transaction.referenceId}) was successful on FlowPay.`,
                    url: window.location.href
                  }).catch(() => {});
                } else {
                  handleCopyRef();
                }
              }}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
