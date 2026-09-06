import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Download,
  Share2,
  Copy,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';

export const MyQRModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user } = useFlowPay();

  const [qrType, setQrType] = useState<'personal' | 'merchant'>('personal');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const upiTarget = qrType === 'personal' ? user.upiId : 'metro.grocers@flowpay';
    const payeeName = qrType === 'personal' ? user.name : 'Metro Gourmet Mart';
    const amountParam = customAmount ? `&am=${encodeURIComponent(customAmount)}` : '';
    const payload = `upi://pay?pa=${upiTarget}&pn=${encodeURIComponent(payeeName)}${amountParam}&cu=INR&tn=FlowPay%20Instant%20Transfer`;

    QRCode.toDataURL(payload, {
      width: 280,
      margin: 2,
      color: {
        dark: qrType === 'personal' ? '#1E40AF' : '#047857',
        light: '#FFFFFF'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
  }, [isOpen, qrType, customAmount, user.upiId, user.name]);

  if (!isOpen) return null;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(user.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `FlowPay_${qrType}_QR_${Date.now()}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Receive Money / My QR</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="p-4 border-b border-slate-100">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setQrType('personal')}
              className={`py-1.5 rounded-lg transition-all ${
                qrType === 'personal' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Personal QR
            </button>
            <button
              type="button"
              onClick={() => setQrType('merchant')}
              className={`py-1.5 rounded-lg transition-all ${
                qrType === 'merchant' ? 'bg-white text-emerald-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Merchant Standee
            </button>
          </div>
        </div>

        {/* QR Display Card */}
        <div className="p-6 space-y-4">
          <div className="bg-gradient-to-b from-blue-50/60 to-slate-50 p-4 rounded-2xl border border-slate-200/80 shadow-inner flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base mb-2 shadow-sm">
              {qrType === 'personal' ? user.name[0] : '🛒'}
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              {qrType === 'personal' ? user.name : 'Metro Gourmet Mart & Cafe'}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 font-mono">
              <span>{qrType === 'personal' ? user.upiId : 'metro.grocers@flowpay'}</span>
              <button
                type="button"
                onClick={handleCopyUPI}
                className="text-blue-600 hover:text-blue-800 p-1"
                title="Copy UPI ID"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* QR Image */}
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200/80 mt-3">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="FlowPay QR Code" className="w-52 h-52 object-contain" />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
                  Generating dynamic QR...
                </div>
              )}
            </div>

            {customAmount && (
              <div className="mt-2 text-xs font-bold text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
                Requesting: ₹{parseFloat(customAmount).toLocaleString()}
              </div>
            )}

            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Bank Credit • FlowPay Protected</span>
            </div>
          </div>

          {/* Amount Modifier */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 text-left mb-1">
              Add Specific Amount (Optional)
            </label>
            <input
              type="number"
              placeholder="e.g. 500 to fix payment amount"
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadQR}
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Save QR</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (navigator.share && qrDataUrl) {
                  navigator.share({
                    title: `${user.name}'s FlowPay QR`,
                    text: `Pay ${user.name} via FlowPay UPI: ${user.upiId}`,
                    url: window.location.href
                  }).catch(() => {});
                } else {
                  handleCopyUPI();
                }
              }}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20 transition-transform active:scale-98"
            >
              <Share2 className="w-4 h-4" />
              <span>Share QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
