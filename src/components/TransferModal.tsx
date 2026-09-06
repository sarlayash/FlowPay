import React, { useState } from 'react';
import {
  X,
  ArrowUpRight,
  User,
  Phone,
  Building2,
  AtSign,
  Search,
  CheckCircle2,
  Sparkles,
  Lock
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';

export const TransferModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, contacts, sendMoney, setActiveModal } = useFlowPay();

  const [transferMode, setTransferMode] = useState<'contact' | 'phone' | 'upi' | 'bank'>('contact');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientUpi, setRecipientUpi] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'FlowPay Wallet' | 'HDFC Bank ••4821' | 'ICICI Bank ••9023'>('FlowPay Wallet');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [securityPin, setSecurityPin] = useState('');
  const [showPinScreen, setShowPinScreen] = useState(false);

  if (!isOpen) return null;

  const filteredContacts = contacts.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.upiId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectContact = (contact: typeof contacts[0]) => {
    setRecipientName(contact.name);
    setRecipientPhone(contact.phone);
    setRecipientUpi(contact.upiId);
  };

  const handleProceedToPin = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!recipientName) {
      alert('Please specify the recipient name');
      return;
    }
    setShowPinScreen(true);
  };

  const handleConfirmTransfer = async () => {
    if (securityPin.length < 4) {
      alert('Please enter 4-digit UPI / FlowPay Security PIN (demo: 1234)');
      return;
    }
    setIsSubmitting(true);
    try {
      await sendMoney({
        recipientName,
        recipientPhone,
        recipientUpi: recipientUpi || `${recipientName.toLowerCase().replace(/\s+/g, '')}@flowpay`,
        amount: parseFloat(amount),
        note,
        paymentMethod: selectedMethod
      });
      onClose();
      // Reset form
      setRecipientName('');
      setAmount('');
      setNote('');
      setSecurityPin('');
      setShowPinScreen(false);
    } catch {
      alert('Transfer failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Instant Money Transfer</h3>
              <p className="text-xs text-slate-500">Zero fee instant UPI & Wallet transfer</p>
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

        {/* Content Body */}
        {!showPinScreen ? (
          <form onSubmit={handleProceedToPin} className="p-6 space-y-5">
            {/* Transfer Mode Selector Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setTransferMode('contact')}
                className={`py-2 rounded-lg transition-all ${
                  transferMode === 'contact' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Contacts
              </button>
              <button
                type="button"
                onClick={() => setTransferMode('phone')}
                className={`py-2 rounded-lg transition-all ${
                  transferMode === 'phone' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Phone
              </button>
              <button
                type="button"
                onClick={() => setTransferMode('upi')}
                className={`py-2 rounded-lg transition-all ${
                  transferMode === 'upi' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                UPI ID
              </button>
              <button
                type="button"
                onClick={() => setTransferMode('bank')}
                className={`py-2 rounded-lg transition-all ${
                  transferMode === 'bank' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Bank A/c
              </button>
            </div>

            {/* Mode Specific Inputs */}
            {transferMode === 'contact' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search name, phone number, or UPI ID..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl p-1">
                  {filteredContacts.map(c => (
                    <div
                      key={c.id}
                      onClick={() => handleSelectContact(c)}
                      className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                        recipientName === c.name ? 'bg-blue-50/80 border border-blue-200' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={c.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`}
                          alt={c.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-800">{c.name}</div>
                          <div className="text-[11px] text-slate-500">{c.upiId}</div>
                        </div>
                      </div>
                      {recipientName === c.name && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {transferMode === 'phone' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">+91</span>
                    <input
                      type="tel"
                      placeholder="98765 00000"
                      value={recipientPhone}
                      onChange={e => {
                        setRecipientPhone(e.target.value);
                        if (!recipientName) setRecipientName(`Contact ${e.target.value.slice(-4)}`);
                      }}
                      className="w-full pl-12 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>
            )}

            {transferMode === 'upi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enter Virtual Payment Address (UPI ID)</label>
                  <input
                    type="text"
                    placeholder="e.g. friend@flowpay or user@okhdfcbank"
                    value={recipientUpi}
                    onChange={e => {
                      setRecipientUpi(e.target.value);
                      if (!recipientName) setRecipientName(e.target.value.split('@')[0]);
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Verified Name</label>
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>
            )}

            {transferMode === 'bank' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="As registered with bank"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Account Number</label>
                    <input
                      type="password"
                      placeholder="Enter account no."
                      value={bankAccount}
                      onChange={e => setBankAccount(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">IFSC Code</label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC0001234"
                      value={bankIfsc}
                      onChange={e => setBankIfsc(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Selected Recipient summary badge */}
            {recipientName && (
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600">Sending to</span>
                  <div className="text-xs font-bold text-slate-900">{recipientName}</div>
                  <div className="text-[11px] text-slate-500">{recipientUpi || recipientPhone || 'Bank Transfer'}</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            )}

            {/* Amount Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Amount to Transfer</label>
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

              {/* Quick Preset Chips */}
              <div className="flex items-center gap-2 mt-2">
                {[100, 500, 1000, 2000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                  >
                    +₹{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Note Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Note (Optional)</label>
              <input
                type="text"
                placeholder="What is this for? e.g. Lunch split, movie tickets"
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            {/* Payment Source Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Debit From</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('FlowPay Wallet')}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedMethod === 'FlowPay Wallet'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs">FlowPay Wallet</div>
                    <div className="text-[10px] text-slate-500">Bal: ₹{user.walletBalance.toLocaleString()}</div>
                  </div>
                  {selectedMethod === 'FlowPay Wallet' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('HDFC Bank ••4821')}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedMethod === 'HDFC Bank ••4821'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs">HDFC Bank ••4821</div>
                    <div className="text-[10px] text-slate-500">Instant UPI Auto-Debit</div>
                  </div>
                  {selectedMethod === 'HDFC Bank ••4821' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!amount || !recipientName}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-transform active:scale-98"
            >
              Proceed to Pay ₹{parseFloat(amount || '0').toLocaleString()}
            </button>
          </form>
        ) : (
          /* PIN Verification Screen (PRD Module 1 & 14: PIN Login & Authentication) */
          <div className="p-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900">Enter FlowPay Security PIN</h4>
              <p className="text-xs text-slate-500 mt-1">
                Authorizing transfer of <span className="font-bold text-slate-800">₹{amount}</span> to <span className="font-bold text-slate-800">{recipientName}</span>
              </p>
            </div>

            <div className="max-w-[200px] mx-auto">
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="••••"
                value={securityPin}
                onChange={e => setSecurityPin(e.target.value.slice(0, 4))}
                className="w-full text-center tracking-[1em] text-3xl font-extrabold py-3 bg-slate-50 border-2 border-blue-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              />
              <span className="text-[11px] text-slate-400 mt-2 block">Demo PIN: 1234 or any 4 digits</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPinScreen(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmTransfer}
                disabled={isSubmitting || securityPin.length < 4}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Transferring...' : 'Authorize Payment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
