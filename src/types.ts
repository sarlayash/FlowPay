export type UserRole = 'consumer' | 'merchant' | 'admin';

export type KYCStatus = 'Verified' | 'Pending' | 'Action Required';

export interface LinkedBankAccount {
  id: string;
  bankName: string;
  accountNumberMasked: string;
  ifsc: string;
  accountType: 'Savings' | 'Current';
  isDefault: boolean;
  upiId: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  upiId: string;
  walletId: string;
  avatar: string;
  kycStatus: KYCStatus;
  role: UserRole;
  walletBalance: number;
  flowCoins: number;
  monthlySpendLimit: number;
  currentMonthSpend: number;
  biometricEnabled: boolean;
  faceIdEnabled: boolean;
  pinSet: boolean;
  linkedAccounts: LinkedBankAccount[];
}

export type TransactionType =
  | 'transfer'
  | 'qr_pay'
  | 'recharge'
  | 'bill_pay'
  | 'add_wallet'
  | 'withdraw'
  | 'cashback'
  | 'gift_card';

export type TransactionCategory =
  | 'transfer'
  | 'recharge'
  | 'electricity'
  | 'water'
  | 'gas'
  | 'broadband'
  | 'shopping'
  | 'food'
  | 'entertainment'
  | 'travel'
  | 'education'
  | 'insurance'
  | 'cashback';

export type TransactionStatus = 'success' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  referenceId: string;
  type: TransactionType;
  category: TransactionCategory;
  title: string;
  description?: string;
  amount: number;
  direction: 'debit' | 'credit';
  status: TransactionStatus;
  timestamp: string; // ISO string
  counterpartyName: string;
  counterpartyUpi?: string;
  counterpartyPhone?: string;
  paymentMethod: 'FlowPay Wallet' | 'HDFC Bank ••4821' | 'ICICI Bank ••9023' | 'UPI';
  cashbackEarned?: number;
  flowCoinsEarned?: number;
  hasScratchCard?: boolean;
  scratchCardId?: string;
  note?: string;
}

export interface ContactItem {
  id: string;
  name: string;
  phone: string;
  upiId: string;
  avatar?: string;
  recentTimestamp?: string;
  isFavorite?: boolean;
}

export interface BillProvider {
  id: string;
  name: string;
  category: 'electricity' | 'water' | 'gas' | 'broadband' | 'landline' | 'education' | 'insurance' | 'municipal';
  icon: string;
  color: string;
  sampleAccountPrompt: string;
  billDueAmount?: number;
  dueDate?: string;
}

export interface RechargePlan {
  id: string;
  price: number;
  validity: string;
  data: string;
  voice: string;
  sms: string;
  description: string;
  tag?: 'Trending' | 'Best Value' | '5G Unlimited' | 'Annual';
}

export interface RechargeProvider {
  id: string;
  name: string;
  type: 'mobile' | 'dth' | 'fastag' | 'metro';
  icon: string;
  circle?: string;
  plans?: RechargePlan[];
}

export interface GiftCardBrand {
  id: string;
  name: string;
  category: 'Shopping' | 'Entertainment' | 'Gaming' | 'Lifestyle';
  logoText: string;
  color: string;
  discountPercentage: number;
  denominations: number[];
  cashbackOffer: string;
}

export interface ScratchCard {
  id: string;
  title: string;
  subtitle: string;
  rewardType: 'cashback' | 'coins' | 'voucher';
  rewardValue: number;
  voucherCode?: string;
  isScratched: boolean;
  scratchedAt?: string;
  color: string;
}

export interface RewardCoupon {
  id: string;
  brand: string;
  title: string;
  code: string;
  discount: string;
  expiresIn: string;
  category: string;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  badge: string;
}

export interface NotificationItem {
  id: string;
  type: 'payment_success' | 'recharge_reminder' | 'offer_alert' | 'security_alert' | 'promotions';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface MerchantData {
  id: string;
  storeName: string;
  merchantUpi: string;
  category: string;
  terminalId: string;
  qrCodeUrl: string;
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  customerCountToday: number;
  settlementPending: number;
  recentPayments: {
    id: string;
    customerName: string;
    customerPhone: string;
    amount: number;
    timestamp: string;
    status: 'settled' | 'received';
  }[];
  topCustomers: {
    name: string;
    phone: string;
    visits: number;
    totalSpent: number;
  }[];
}

export interface AdminMetrics {
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  totalGmv: number;
  totalTransactionsCount: number;
  successRate: number;
  avgTransactionValue: number;
  retentionRate: number;
  csatScore: number;
  walletFloatBalance: number;
  systemHealth: 'Optimal' | 'Degraded';
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  chartData?: {
    type: 'pie' | 'bar';
    labels: string[];
    values: number[];
  };
  insights?: string[];
  suggestedActions?: string[];
}
