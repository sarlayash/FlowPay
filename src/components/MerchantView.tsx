import React, { useState } from 'react';
import {
  Store,
  Volume2,
  QrCode,
  ArrowUpRight,
  TrendingUp,
  Download,
  Users,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Bell,
  Star,
  Receipt,
  Play
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';
import { playSoundboxAnnouncement } from '../utils/soundEffects';

export const MerchantView: React.FC = () => {
  const { merchantData, playSoundAlert, isSoundboxEnabled, toggleSoundbox, setActiveModal } = useFlowPay();

  const [testAmount, setTestAmount] = useState('320');
  const [selectedTxForRefund, setSelectedTxForRefund] = useState<string | null>(null);

  const handleTestSoundbox = () => {
    const num = parseFloat(testAmount) || 320;
    playSoundAlert(num);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Merchant Header Profile */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-2xl font-bold">
              🛒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{merchantData.storeName}</h2>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  Verified Merchant
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                Terminal ID: <span className="font-mono text-white">{merchantData.terminalId}</span> • VPA: <span className="font-mono text-white">{merchantData.upiId}</span>
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-emerald-100/80">
                <span>⭐ {merchantData.rating} Rating ({merchantData.reviewsCount} reviews)</span>
                <span>•</span>
                <span>Zero MDR on UPI</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveModal('my_qr')}
              className="px-4 py-2 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold shadow-sm flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-emerald-700" />
              <span>Standee QR Code</span>
            </button>
            <button
              type="button"
              onClick={() => alert(`Settlement of ₹${merchantData.pendingSettlement} initiated to ${merchantData.bankAccount}`)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Settle ₹{merchantData.pendingSettlement.toLocaleString()} Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row (PRD Module 12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Today's Collections</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            ₹{merchantData.todayCollections.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs yesterday</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Orders Today</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {merchantData.todayOrdersCount} orders
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Avg ticket size: ₹{Math.round(merchantData.todayCollections / merchantData.todayOrdersCount)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Pending Bank Settlement</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            ₹{merchantData.pendingSettlement.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Auto-settles at 11:30 PM</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Settlement Account</span>
          <div className="text-sm font-bold text-slate-900 mt-1 truncate">
            {merchantData.bankAccount}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Active
          </div>
        </div>
      </div>

      {/* Interactive FlowPay Soundbox Simulator (PRD Persona 2 & Module 12) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Volume2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">FlowPay Smart Soundbox 4G</h3>
              <p className="text-xs text-slate-500">Live bilingual voice payment confirmation terminal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-semibold text-slate-700">Audio Alerts:</span>
              <input
                type="checkbox"
                checked={isSoundboxEnabled}
                onChange={toggleSoundbox}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-emerald-600">
                {isSoundboxEnabled ? 'Enabled' : 'Muted'}
              </span>
            </label>
          </div>
        </div>

        {/* Soundbox Simulator Console */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-700 border-2 border-amber-400 flex items-center justify-center text-amber-400">
              <Volume2 className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono text-amber-400">SOUNDBOX 4G TERMINAL ONLINE</div>
              <div className="text-sm font-bold text-white">Simulate Customer QR Payment Voice Announcement</div>
              <div className="text-xs text-slate-400 mt-0.5">Plays authentic synthesized chime & speech alert</div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={testAmount}
                onChange={e => setTestAmount(e.target.value)}
                className="w-28 pl-7 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              type="button"
              onClick={handleTestSoundbox}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Broadcast Chime</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer QR Payments Live Feed */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Today's In-Store QR Collections</h3>
            <p className="text-xs text-slate-500">Live incoming customer payments</p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Day Book</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            { customer: 'Rahul Sharma', time: '10:42 AM', amount: 320, mode: 'UPI QR', ref: 'FP-QR-9821' },
            { customer: 'Priya Patel', time: '10:15 AM', amount: 450, mode: 'BharatQR', ref: 'FP-QR-9819' },
            { customer: 'Amitabh Roy', time: '09:50 AM', amount: 180, mode: 'FlowPay Wallet', ref: 'FP-QR-9815' },
            { customer: 'Sunita Rao', time: '09:22 AM', amount: 760, mode: 'GooglePay UPI', ref: 'FP-QR-9811' },
            { customer: 'Kunal Deshmukh', time: '08:45 AM', amount: 210, mode: 'PhonePe UPI', ref: 'FP-QR-9807' }
          ].map((item, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  {item.customer[0]}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.customer}</div>
                  <div className="text-[11px] text-slate-400">
                    {item.time} • {item.mode} • <span className="font-mono">{item.ref}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-emerald-600">+₹{item.amount}</span>
                <button
                  type="button"
                  onClick={() => alert(`Initiated refund request for ₹${item.amount} to ${item.customer}`)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Refund
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
