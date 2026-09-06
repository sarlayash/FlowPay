import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  TrendingUp,
  FileCheck,
  Lock,
  Search,
  Filter
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';

interface KycItem {
  id: string;
  name: string;
  pan: string;
  aadhaarMasked: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
}

const INITIAL_KYC_QUEUE: KycItem[] = [
  { id: 'kyc_1', name: 'Rohan Deshmukh', pan: 'ABCDE1234F', aadhaarMasked: '•••• •••• 9812', status: 'pending', submittedAt: '10 mins ago' },
  { id: 'kyc_2', name: 'Ananya Singhania', pan: 'FGHIJ5678K', aadhaarMasked: '•••• •••• 4519', status: 'pending', submittedAt: '25 mins ago' },
  { id: 'kyc_3', name: 'Metro Cafe Ltd', pan: 'AAACM9981Q', aadhaarMasked: '•••• •••• 7120', status: 'verified', submittedAt: '2 hours ago' }
];

interface FraudAlert {
  id: string;
  user: string;
  amount: number;
  reason: string;
  riskScore: number;
  time: string;
  status: 'flagged' | 'resolved' | 'frozen';
}

const INITIAL_FRAUD_ALERTS: FraudAlert[] = [
  { id: 'fa_1', user: 'Unknown Device IP (Tor)', amount: 48500, reason: 'Rapid sequential micro-transfers from newly bound device', riskScore: 92, time: '12m ago', status: 'flagged' },
  { id: 'fa_2', user: 'Vikram Stores (POS #4)', amount: 150000, reason: 'Spike in high-value midnight credit card swipe', riskScore: 78, time: '1h ago', status: 'flagged' }
];

export const AdminView: React.FC = () => {
  const [kycList, setKycList] = useState<KycItem[]>(INITIAL_KYC_QUEUE);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(INITIAL_FRAUD_ALERTS);

  const handleApproveKyc = (id: string) => {
    setKycList(prev => prev.map(k => (k.id === id ? { ...k, status: 'verified' } : k)));
  };

  const handleRejectKyc = (id: string) => {
    setKycList(prev => prev.map(k => (k.id === id ? { ...k, status: 'rejected' } : k)));
  };

  const handleFreezeAccount = (id: string) => {
    setFraudAlerts(prev => prev.map(f => (f.id === id ? { ...f, status: 'frozen' } : f)));
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                CORE SYSTEM MONITOR ONLINE
              </span>
            </div>
            <h2 className="text-2xl font-bold">FlowPay Platform Sentinel & Admin Portal</h2>
            <p className="text-xs text-slate-300 mt-1">
              Real-time monitoring of NPCI UPI settlement gateways, AML fraud engines, and compliance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl font-mono text-emerald-300">
              TPS: 2,840 / sec
            </span>
            <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl font-mono text-blue-300">
              Latency: 42ms
            </span>
          </div>
        </div>
      </div>

      {/* Gateway Health & KPIs (PRD Module 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Daily Platform GMV</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">₹18.42 Cr</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.1% MoM growth</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">UPI Switch Success Rate</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">99.98%</div>
          <div className="text-[11px] text-slate-500 mt-1">NPCI UPI 2.0 SLA compliant</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Active Registered Users</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">1,248,920</div>
          <div className="text-[11px] text-slate-500 mt-1">42,100 verified merchants</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">AML & Fraud Alerts</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">
            {fraudAlerts.filter(f => f.status === 'flagged').length} Pending
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">Real-time risk scoring active</div>
        </div>
      </div>

      {/* Gateway Nodes Status Indicator */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Critical Infrastructure Nodes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { node: 'NPCI UPI Switch Gateway', status: 'Operational', ping: '38ms' },
            { node: 'HDFC Bank Node 01', status: 'Operational', ping: '44ms' },
            { node: 'BBPS Bharat BillPay Node', status: 'Operational', ping: '52ms' },
            { node: 'SMS OTP Delivery (Airtel/Jio)', status: 'Operational', ping: '1.2s delivery' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-800 truncate">{item.node}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                <span>{item.status}</span>
                <span className="font-mono text-emerald-600 font-semibold">{item.ping}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Fraud Alerts Sentinel + KYC Verification Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Sentinel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">Fraud & AML Sentinel</h3>
            </div>
            <span className="text-xs font-bold bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200">
              AI Risk Threshold: &gt;75
            </span>
          </div>

          <div className="space-y-3">
            {fraudAlerts.map(alertItem => (
              <div
                key={alertItem.id}
                className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900">{alertItem.user}</span>
                    <div className="text-xs font-extrabold text-rose-700">₹{alertItem.amount.toLocaleString()}</div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-rose-600 text-white px-2 py-0.5 rounded-md">
                    Risk: {alertItem.riskScore}/100
                  </span>
                </div>
                <p className="text-xs text-slate-600">{alertItem.reason}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">{alertItem.time}</span>
                  <div className="flex items-center gap-2">
                    {alertItem.status === 'frozen' ? (
                      <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        Account Frozen
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleFreezeAccount(alertItem.id)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs"
                        >
                          Freeze Account
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFraudAlerts(prev =>
                              prev.map(f => (f.id === alertItem.id ? { ...f, status: 'resolved' } : f))
                            )
                          }
                          className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KYC Compliance Queue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">KYC Verification Approvals</h3>
            </div>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Aadhaar / PAN Vault
            </span>
          </div>

          <div className="space-y-3">
            {kycList.map(kyc => (
              <div
                key={kyc.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{kyc.name}</div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    PAN: <span className="text-slate-800 font-bold">{kyc.pan}</span> • Aadhaar: {kyc.aadhaarMasked}
                  </div>
                  <span className="text-[10px] text-slate-400">Submitted {kyc.submittedAt}</span>
                </div>

                <div>
                  {kyc.status === 'pending' ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleApproveKyc(kyc.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectKyc(kyc.id)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100"
                      >
                        Reject
                      </button>
                    </div>
                  ) : kyc.status === 'verified' ? (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
