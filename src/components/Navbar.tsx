import React, { useState } from 'react';
import {
  Wallet,
  Bell,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronDown,
  Store,
  LayoutDashboard,
  User,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useFlowPay } from '../context/FlowPayContext';

export const Navbar: React.FC<{ onStartDemoTour: () => void }> = ({ onStartDemoTour }) => {
  const {
    user,
    activeView,
    setActiveView,
    setActiveModal,
    isBalanceVisible,
    setIsBalanceVisible,
    isSoundboxMuted,
    setIsSoundboxMuted,
    unreadCount,
    setIsAiDrawerOpen,
    switchPersona
  } = useFlowPay();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('consumer')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <span className="font-extrabold text-xl tracking-tighter">FP</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Flow<span className="text-blue-600">Pay</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200/60">
                Super App
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Digital Payments & Financial OS</p>
          </div>
        </div>

        {/* Center: Persona & Mode Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
          >
            {activeView === 'merchant' ? (
              <>
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span>Merchant: Metro Mart</span>
              </>
            ) : activeView === 'admin' ? (
              <>
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin Console</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>User: {user.name.split(' ')[0]} ({user.id === 'usr_001' ? 'Student' : 'Professional'})</span>
              </>
            )}
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {isPersonaMenuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Switch PRD Persona / Mode
              </div>
              <button
                type="button"
                onClick={() => {
                  switchPersona('rahul');
                  setIsPersonaMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-blue-50/70 transition-colors ${
                  activeView === 'consumer' && user.id === 'usr_001' ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-medium">Persona 1: Rahul (Age 21)</div>
                  <div className="text-[11px] text-slate-500">Student • Recharge & Split Bills • ₹8,450</div>
                </div>
                {activeView === 'consumer' && user.id === 'usr_001' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  switchPersona('priya');
                  setIsPersonaMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-blue-50/70 transition-colors ${
                  activeView === 'consumer' && user.id === 'usr_002' ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-medium">Persona 2: Priya (Age 30)</div>
                  <div className="text-[11px] text-slate-500">Working Pro • Bills & High Wallet • ₹34,850</div>
                </div>
                {activeView === 'consumer' && user.id === 'usr_002' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </button>

              <div className="h-px bg-slate-100 my-1"></div>

              <button
                type="button"
                onClick={() => {
                  switchPersona('merchant');
                  setIsPersonaMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-emerald-50/70 transition-colors ${
                  activeView === 'merchant' ? 'bg-emerald-50 font-semibold text-emerald-700' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-medium">Persona 3: Shop Owner (Merchant)</div>
                  <div className="text-[11px] text-slate-500">QR Terminal • Instant Settlement • POS</div>
                </div>
                {activeView === 'merchant' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  switchPersona('admin');
                  setIsPersonaMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-indigo-50/70 transition-colors ${
                  activeView === 'admin' ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-medium">Executive Admin Panel</div>
                  <div className="text-[11px] text-slate-500">DAU/MAU • Live Logs • System Health</div>
                </div>
                {activeView === 'admin' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Guided Tour Button */}
          <button
            type="button"
            onClick={onStartDemoTour}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors shadow-2xs"
            title="Suggested Demo Workflow from PRD"
          >
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>PRD Tour</span>
          </button>

          {/* Soundbox Voice Audio Toggle */}
          <button
            type="button"
            onClick={() => setIsSoundboxMuted(!isSoundboxMuted)}
            className={`p-2 rounded-lg border transition-colors ${
              isSoundboxMuted
                ? 'bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
            title={isSoundboxMuted ? 'Soundbox announcements muted' : 'Soundbox voice chime active'}
          >
            {isSoundboxMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* AI Finance Assistant Button */}
          <button
            type="button"
            onClick={() => setIsAiDrawerOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">AI Advisor</span>
          </button>

          {/* Notification Bell */}
          <button
            type="button"
            onClick={() => setActiveModal('notifications')}
            className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Profile Pill */}
          <button
            type="button"
            onClick={() => setActiveView('profile')}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500/30"
            />
            <span className="text-xs font-medium text-slate-800 hidden lg:inline max-w-[80px] truncate">
              {user.name.split(' ')[0]}
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 hidden sm:inline" />
          </button>
        </div>
      </div>
    </header>
  );
};
