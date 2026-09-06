import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Transaction,
  ContactItem,
  ScratchCard,
  NotificationItem,
  MerchantData,
  AdminMetrics,
  UserRole
} from '../types';
import {
  INITIAL_USER,
  INITIAL_CONTACTS,
  INITIAL_TRANSACTIONS,
  INITIAL_SCRATCH_CARDS,
  INITIAL_NOTIFICATIONS,
  MERCHANT_DATA,
  ADMIN_METRICS
} from '../data/mockData';
import { playSuccessChime, playSoundboxAnnouncement } from '../utils/soundEffects';

interface SendMoneyPayload {
  recipientName: string;
  recipientPhone?: string;
  recipientUpi?: string;
  amount: number;
  note?: string;
  paymentMethod: 'FlowPay Wallet' | 'HDFC Bank ••4821' | 'ICICI Bank ••9023' | 'UPI';
}

interface RechargePayload {
  providerName: string;
  rechargeType: 'mobile' | 'dth' | 'fastag' | 'metro';
  targetIdentifier: string; // phone or consumer number
  amount: number;
  planDescription?: string;
}

interface BillPayload {
  providerName: string;
  category: any;
  consumerNumber: string;
  amount: number;
}

interface FlowPayContextType {
  user: UserProfile;
  contacts: ContactItem[];
  transactions: Transaction[];
  scratchCards: ScratchCard[];
  notifications: NotificationItem[];
  merchantData: MerchantData;
  adminMetrics: AdminMetrics;
  activeView: 'consumer' | 'merchant' | 'admin' | 'history' | 'rewards' | 'profile';
  setActiveView: (view: 'consumer' | 'merchant' | 'admin' | 'history' | 'rewards' | 'profile') => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (tx: Transaction | null) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isSoundboxMuted: boolean;
  setIsSoundboxMuted: (muted: boolean) => void;
  isBalanceVisible: boolean;
  setIsBalanceVisible: (visible: boolean) => void;
  unreadCount: number;

  // Actions
  sendMoney: (payload: SendMoneyPayload) => Promise<Transaction>;
  addMoneyToWallet: (amount: number, source: string) => Promise<Transaction>;
  withdrawToBank: (amount: number, bankName: string) => Promise<Transaction>;
  payRecharge: (payload: RechargePayload) => Promise<Transaction>;
  payBill: (payload: BillPayload) => Promise<Transaction>;
  payViaQR: (merchantName: string, upiId: string, amount: number, note?: string) => Promise<Transaction>;
  scratchCardAction: (cardId: string) => Promise<{ rewardType: string; rewardValue: number }>;
  settleMerchantBalance: () => void;
  markNotificationRead: (id?: string) => void;
  switchPersona: (persona: 'rahul' | 'priya' | 'merchant' | 'admin') => void;
  updateUserKyc: (status: 'Verified' | 'Pending') => void;
  toggleBiometrics: () => void;
}

const FlowPayContext = createContext<FlowPayContextType | undefined>(undefined);

export const FlowPayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('flowpay_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('flowpay_txs');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [contacts, setContacts] = useState<ContactItem[]>(INITIAL_CONTACTS);
  const [scratchCards, setScratchCards] = useState<ScratchCard[]>(INITIAL_SCRATCH_CARDS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [merchantData, setMerchantData] = useState<MerchantData>(MERCHANT_DATA);
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>(ADMIN_METRICS);

  const [activeView, setActiveView] = useState<'consumer' | 'merchant' | 'admin' | 'history' | 'rewards' | 'profile'>('consumer');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isSoundboxMuted, setIsSoundboxMuted] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('flowpay_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('flowpay_txs', JSON.stringify(transactions));
  }, [transactions]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2563EB', '#10B981', '#F59E0B', '#6366F1']
      });
    } catch {
      // ignore
    }
  };

  // Helper to record notification
  const addNotification = (title: string, message: string, type: any) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 1. Send Money (P2P Transfer)
  const sendMoney = async (payload: SendMoneyPayload): Promise<Transaction> => {
    const refId = `FP-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const isWallet = payload.paymentMethod === 'FlowPay Wallet';

    // Deduct wallet if paid via wallet
    if (isWallet) {
      setUser(prev => ({
        ...prev,
        walletBalance: Math.max(0, prev.walletBalance - payload.amount),
        currentMonthSpend: prev.currentMonthSpend + payload.amount
      }));
    }

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      referenceId: refId,
      type: 'transfer',
      category: 'transfer',
      title: `Sent to ${payload.recipientName}`,
      amount: payload.amount,
      direction: 'debit',
      status: 'success',
      timestamp: new Date().toISOString(),
      counterpartyName: payload.recipientName,
      counterpartyPhone: payload.recipientPhone,
      counterpartyUpi: payload.recipientUpi,
      paymentMethod: payload.paymentMethod,
      note: payload.note
    };

    setTransactions(prev => [tx, ...prev]);

    // Update contacts or add to recent
    setContacts(prev => {
      const exists = prev.find(c => c.name.toLowerCase() === payload.recipientName.toLowerCase());
      if (exists) {
        return prev.map(c => c.id === exists.id ? { ...c, recentTimestamp: 'Just now' } : c);
      }
      return [
        {
          id: `c_${Date.now()}`,
          name: payload.recipientName,
          phone: payload.recipientPhone || '+91 99999 00000',
          upiId: payload.recipientUpi || `${payload.recipientName.toLowerCase().replace(/\s+/g, '')}@flowpay`,
          recentTimestamp: 'Just now'
        },
        ...prev
      ];
    });

    addNotification('Transfer Completed', `₹${payload.amount} successfully transferred to ${payload.recipientName}.`, 'payment_success');

    if (!isSoundboxMuted) playSuccessChime();
    triggerCelebration();

    return tx;
  };

  // 2. Add Money to Wallet
  const addMoneyToWallet = async (amount: number, source: string): Promise<Transaction> => {
    const refId = `FP-TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    setUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount
    }));

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      referenceId: refId,
      type: 'add_wallet',
      category: 'transfer',
      title: 'Added to FlowPay Wallet',
      amount,
      direction: 'credit',
      status: 'success',
      timestamp: new Date().toISOString(),
      counterpartyName: source,
      paymentMethod: 'FlowPay Wallet'
    };

    setTransactions(prev => [tx, ...prev]);
    addNotification('Money Added to Wallet', `₹${amount} added successfully via ${source}.`, 'payment_success');
    if (!isSoundboxMuted) playSuccessChime();
    triggerCelebration();

    return tx;
  };

  // 3. Withdraw to Bank
  const withdrawToBank = async (amount: number, bankName: string): Promise<Transaction> => {
    const refId = `FP-TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    setUser(prev => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - amount)
    }));

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      referenceId: refId,
      type: 'withdraw',
      category: 'transfer',
      title: `Transferred to ${bankName}`,
      amount,
      direction: 'debit',
      status: 'success',
      timestamp: new Date().toISOString(),
      counterpartyName: bankName,
      paymentMethod: 'FlowPay Wallet'
    };

    setTransactions(prev => [tx, ...prev]);
    addNotification('Withdrawal Successful', `₹${amount} transferred to ${bankName}.`, 'payment_success');
    if (!isSoundboxMuted) playSuccessChime();

    return tx;
  };

  // 4. Pay Mobile / DTH / FASTag / Metro Recharge
  const payRecharge = async (payload: RechargePayload): Promise<Transaction> => {
    const refId = `FP-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const coinsEarned = Math.floor(payload.amount * 0.1);

    setUser(prev => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - payload.amount),
      currentMonthSpend: prev.currentMonthSpend + payload.amount,
      flowCoins: prev.flowCoins + coinsEarned
    }));

    // Chance to grant scratch card
    const newScratchCard: ScratchCard = {
      id: `sc_${Date.now()}`,
      title: `${payload.providerName} Recharge Reward`,
      subtitle: 'Scratch to reveal your cashback!',
      rewardType: 'cashback',
      rewardValue: Math.floor(Math.random() * 35) + 15,
      isScratched: false,
      color: '#2563EB'
    };
    setScratchCards(prev => [newScratchCard, ...prev]);

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      referenceId: refId,
      type: 'recharge',
      category: 'recharge',
      title: `${payload.providerName} Recharge`,
      description: payload.planDescription || `Number: ${payload.targetIdentifier}`,
      amount: payload.amount,
      direction: 'debit',
      status: 'success',
      timestamp: new Date().toISOString(),
      counterpartyName: payload.providerName,
      counterpartyPhone: payload.targetIdentifier,
      paymentMethod: 'FlowPay Wallet',
      flowCoinsEarned: coinsEarned,
      hasScratchCard: true,
      scratchCardId: newScratchCard.id
    };

    setTransactions(prev => [tx, ...prev]);
    addNotification('Recharge Successful', `${payload.providerName} recharge of ₹${payload.amount} was successful! Earned ${coinsEarned} FlowCoins.`, 'payment_success');
    if (!isSoundboxMuted) playSuccessChime();
    triggerCelebration();

    return tx;
  };

  // 5. Pay Utility Bills
  const payBill = async (payload: BillPayload): Promise<Transaction> => {
    const refId = `FP-TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    setUser(prev => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - payload.amount),
      currentMonthSpend: prev.currentMonthSpend + payload.amount
    }));

    const newScratchCard: ScratchCard = {
      id: `sc_${Date.now()}`,
      title: `${payload.providerName} Bill Cashback`,
      subtitle: 'Guaranteed cashback on prompt bill payments!',
      rewardType: 'cashback',
      rewardValue: Math.floor(Math.random() * 50) + 25,
      isScratched: false,
      color: '#059669'
    };
    setScratchCards(prev => [newScratchCard, ...prev]);

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      referenceId: refId,
      type: 'bill_pay',
      category: payload.category || 'electricity',
      title: `${payload.providerName} Payment`,
      description: `Account: ${payload.consumerNumber}`,
      amount: payload.amount,
      direction: 'debit',
      status: 'success',
      timestamp: new Date().toISOString(),
      counterpartyName: payload.providerName,
      paymentMethod: 'FlowPay Wallet',
      hasScratchCard: true,
      scratchCardId: newScratchCard.id
    };

    setTransactions(prev => [tx, ...prev]);
    addNotification('Bill Payment Successful', `₹${payload.amount} paid to ${payload.providerName}. Scratch card unlocked!`, 'payment_success');
    if (!isSoundboxMuted) playSuccessChime();
    triggerCelebration();

    return tx;
  };

  // 6. QR Code Payment
  const payViaQR = async (merchantName: string, upiId: string, amount: number, note?: string): Promise<Transaction> => {
    const refId = `FP-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const cashback = Math.floor(Math.random() * 20) + 5;

    setUser(prev => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - amount),
      currentMonthSpend: prev.currentMonthSpend + amount
    }));

    // If payment goes to Metro Gourmet Mart (our merchant demo), update merchant data live!
    if (merchantName.toLowerCase().includes('metro') || upiId.includes('metro.grocers')) {
      setMerchantData(prev => ({
        ...prev,
        todayRevenue: prev.todayRevenue + amount,
        weeklyRevenue: prev.weeklyRevenue + amount,
        monthlyRevenue: prev.monthlyRevenue + amount,
        customerCountToday: prev.customerCountToday + 1,
        settlementPending: prev.settlementPending + amount,
        recentPayments: [
          {
            id: `mp_${Date.now()}`,
            customerName: user.name,
            customerPhone: user.phone,
            amount,
            timestamp: 'Just now',
            status: 'received'
          },
          ...prev.recentPayments
        ]
      }));
    }

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      referenceId: refId,
      type: 'qr_pay',
      category: 'shopping',
      title: merchantName,
      description: note || 'QR Code Scan & Pay',
      amount,
      direction: 'debit',
      status: 'success',
      timestamp: new Date().toISOString(),
      counterpartyName: merchantName,
      counterpartyUpi: upiId,
      paymentMethod: 'FlowPay Wallet',
      cashbackEarned: cashback
    };

    setTransactions(prev => [tx, ...prev]);
    addNotification('QR Payment Successful', `₹${amount} paid to ${merchantName}.`, 'payment_success');

    if (!isSoundboxMuted) {
      playSoundboxAnnouncement(amount);
    }
    triggerCelebration();

    return tx;
  };

  // 7. Scratch Card reveal action
  const scratchCardAction = async (cardId: string) => {
    const card = scratchCards.find(c => c.id === cardId);
    if (!card || card.isScratched) return { rewardType: 'cashback', rewardValue: 0 };

    setScratchCards(prev =>
      prev.map(c => c.id === cardId ? { ...c, isScratched: true, scratchedAt: 'Just now' } : c)
    );

    if (card.rewardType === 'cashback') {
      setUser(prev => ({
        ...prev,
        walletBalance: prev.walletBalance + card.rewardValue
      }));
      // Record transaction
      const cashbackTx: Transaction = {
        id: `tx_${Date.now()}`,
        referenceId: `FP-CB-${Math.floor(100000 + Math.random() * 900000)}`,
        type: 'cashback',
        category: 'cashback',
        title: `Cashback: ${card.title}`,
        amount: card.rewardValue,
        direction: 'credit',
        status: 'success',
        timestamp: new Date().toISOString(),
        counterpartyName: 'FlowPay Rewards',
        paymentMethod: 'FlowPay Wallet'
      };
      setTransactions(prev => [cashbackTx, ...prev]);
      addNotification('Cashback Credited!', `₹${card.rewardValue} cashback has been credited to your FlowPay wallet.`, 'offer_alert');
    } else if (card.rewardType === 'coins') {
      setUser(prev => ({
        ...prev,
        flowCoins: prev.flowCoins + card.rewardValue
      }));
      addNotification('FlowCoins Added!', `${card.rewardValue} FlowCoins added to your rewards vault.`, 'offer_alert');
    }

    if (!isSoundboxMuted) playSuccessChime();
    triggerCelebration();

    return { rewardType: card.rewardType, rewardValue: card.rewardValue };
  };

  // 8. Settle merchant pending revenue
  const settleMerchantBalance = () => {
    const amount = merchantData.settlementPending;
    if (amount <= 0) return;

    setMerchantData(prev => ({
      ...prev,
      settlementPending: 0,
      recentPayments: prev.recentPayments.map(p => ({ ...p, status: 'settled' }))
    }));

    addNotification('Merchant Settlement Executed', `₹${amount.toLocaleString()} settled to HDFC Current Account ••9912.`, 'payment_success');
    if (!isSoundboxMuted) playSuccessChime();
    triggerCelebration();
  };

  const markNotificationRead = (id?: string) => {
    if (id) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } else {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  // 9. Persona Switcher (PRD Personas: Rahul 21 Student, Priya 30 Professional, Shop Owner, Admin)
  const switchPersona = (persona: 'rahul' | 'priya' | 'merchant' | 'admin') => {
    if (persona === 'rahul') {
      setUser(INITIAL_USER);
      setActiveView('consumer');
    } else if (persona === 'priya') {
      setUser({
        ...INITIAL_USER,
        id: 'usr_002',
        name: 'Priya Patel',
        phone: '+91 98234 11223',
        email: 'priya.patel@flowpay.me',
        upiId: 'priya@flowpay',
        walletId: 'FP-9901-7721',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        walletBalance: 34850.00,
        flowCoins: 4320,
        monthlySpendLimit: 50000,
        currentMonthSpend: 18450,
        role: 'consumer'
      });
      setActiveView('consumer');
    } else if (persona === 'merchant') {
      setActiveView('merchant');
    } else if (persona === 'admin') {
      setActiveView('admin');
    }
  };

  const updateUserKyc = (status: 'Verified' | 'Pending') => {
    setUser(prev => ({ ...prev, kycStatus: status }));
    addNotification('KYC Verification', `Your KYC verification is marked as ${status}.`, 'security_alert');
  };

  const toggleBiometrics = () => {
    setUser(prev => ({ ...prev, biometricEnabled: !prev.biometricEnabled }));
  };

  return (
    <FlowPayContext.Provider
      value={{
        user,
        contacts,
        transactions,
        scratchCards,
        notifications,
        merchantData,
        adminMetrics,
        activeView,
        setActiveView,
        activeModal,
        setActiveModal,
        selectedTransaction,
        setSelectedTransaction,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isSoundboxMuted,
        setIsSoundboxMuted,
        isBalanceVisible,
        setIsBalanceVisible,
        unreadCount,

        sendMoney,
        addMoneyToWallet,
        withdrawToBank,
        payRecharge,
        payBill,
        payViaQR,
        scratchCardAction,
        settleMerchantBalance,
        markNotificationRead,
        switchPersona,
        updateUserKyc,
        toggleBiometrics
      }}
    >
      {children}
    </FlowPayContext.Provider>
  );
};

export const useFlowPay = () => {
  const context = useContext(FlowPayContext);
  if (!context) {
    throw new Error('useFlowPay must be used within a FlowPayProvider');
  }
  return context;
};
