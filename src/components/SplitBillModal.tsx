import React, { useState } from 'react';
import {
  X,
  Split,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  Share2,
  ArrowRight
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';

export const SplitBillModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, contacts } = useFlowPay();

  const [billTitle, setBillTitle] = useState('Dinner at Olive Bistro');
  const [totalAmount, setTotalAmount] = useState('1800');
  const [members, setMembers] = useState<string[]>([user.name, 'Priya Patel', 'Aman Verma']);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const numTotal = parseFloat(totalAmount) || 0;
  const perPerson = members.length > 0 ? (numTotal / members.length).toFixed(2) : '0';

  const handleAddMember = (contactName: string) => {
    if (!members.includes(contactName)) {
      setMembers([...members, contactName]);
    }
  };

  const handleRemoveMember = (nameToRemove: string) => {
    if (nameToRemove === user.name) return; // Keep self
    setMembers(members.filter(m => m !== nameToRemove));
  };

  const handleSendRequests = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Split Bill with Friends</h3>
              <p className="text-xs text-slate-500">Calculate & request shares with 1-click UPI links</p>
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

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Payment Requests Sent!</h4>
            <p className="text-xs text-slate-500">
              FlowPay UPI collect requests of <span className="font-bold text-slate-800">₹{perPerson}</span> each sent to {members.filter(m => m !== user.name).join(', ')}.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expense / Bill Title</label>
              <input
                type="text"
                value={billTitle}
                onChange={e => setBillTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Bill Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-lg font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={e => setTotalAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-slate-900"
                />
              </div>
            </div>

            {/* Split Calculation Card */}
            <div className="p-4 bg-violet-50/70 border border-violet-200/80 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-violet-700">Calculated Equal Share</span>
                <div className="text-2xl font-extrabold text-violet-950">₹{perPerson}</div>
                <div className="text-[11px] text-violet-700">Split among {members.length} people</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold">
                ÷{members.length}
              </div>
            </div>

            {/* Members List */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Participants</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {members.map(m => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    <span>{m}</span>
                    {m !== user.name && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {/* Add friends chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400">Add from contacts:</span>
                {contacts.slice(0, 4).map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleAddMember(c.name)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 hover:bg-violet-50 hover:text-violet-700 border border-slate-200 font-medium"
                  >
                    + {c.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendRequests}
              disabled={!numTotal || members.length <= 1}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md shadow-violet-500/25 transition-transform active:scale-98 disabled:opacity-50"
            >
              Send Split Requests (₹{perPerson} each)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
