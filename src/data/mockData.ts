import {
  UserProfile,
  Transaction,
  ContactItem,
  BillProvider,
  RechargeProvider,
  GiftCardBrand,
  ScratchCard,
  RewardCoupon,
  Achievement,
  NotificationItem,
  MerchantData,
  AdminMetrics
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_001',
  name: 'Rahul Sharma',
  phone: '+91 98765 43210',
  email: 'rahul.sharma@flowpay.me',
  upiId: 'rahul@flowpay',
  walletId: 'FP-8892-0192',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  kycStatus: 'Verified',
  role: 'consumer',
  walletBalance: 8450.00,
  flowCoins: 1280,
  monthlySpendLimit: 25000,
  currentMonthSpend: 11240,
  biometricEnabled: true,
  faceIdEnabled: true,
  pinSet: true,
  linkedAccounts: [
    {
      id: 'bank_01',
      bankName: 'HDFC Bank',
      accountNumberMasked: '•••• 4821',
      ifsc: 'HDFC0001243',
      accountType: 'Savings',
      isDefault: true,
      upiId: 'rahul@okhdfcbank'
    },
    {
      id: 'bank_02',
      bankName: 'ICICI Bank',
      accountNumberMasked: '•••• 9023',
      ifsc: 'ICIC0000344',
      accountType: 'Savings',
      isDefault: false,
      upiId: 'rahul@icici'
    }
  ]
};

export const INITIAL_CONTACTS: ContactItem[] = [
  {
    id: 'c1',
    name: 'Priya Patel',
    phone: '+91 98234 11223',
    upiId: 'priya@flowpay',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    isFavorite: true,
    recentTimestamp: '2 hours ago'
  },
  {
    id: 'c2',
    name: 'Aman Verma',
    phone: '+91 97123 99881',
    upiId: 'aman.v@oksbi',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    isFavorite: true,
    recentTimestamp: 'Yesterday'
  },
  {
    id: 'c3',
    name: 'Neha Gupta',
    phone: '+91 99882 33445',
    upiId: 'neha@paytm',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isFavorite: false,
    recentTimestamp: '3 days ago'
  },
  {
    id: 'c4',
    name: 'Karan Mehra',
    phone: '+91 96541 22334',
    upiId: 'karan@flowpay',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isFavorite: false,
    recentTimestamp: '1 week ago'
  },
  {
    id: 'c5',
    name: 'Vikram Joshi (Roommate)',
    phone: '+91 98450 77889',
    upiId: 'vikram@flowpay',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isFavorite: true,
    recentTimestamp: '4 days ago'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_101',
    referenceId: 'FP-TXN-984210',
    type: 'transfer',
    category: 'transfer',
    title: 'Sent to Priya Patel',
    amount: 750,
    direction: 'debit',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    counterpartyName: 'Priya Patel',
    counterpartyUpi: 'priya@flowpay',
    paymentMethod: 'FlowPay Wallet',
    note: 'Dinner split - Olive Bistro'
  },
  {
    id: 'tx_102',
    referenceId: 'FP-TXN-984209',
    type: 'qr_pay',
    category: 'food',
    title: 'Blue Tokai Coffee Roasters',
    amount: 320,
    direction: 'debit',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    counterpartyName: 'Blue Tokai Merchant',
    paymentMethod: 'FlowPay Wallet',
    cashbackEarned: 15,
    hasScratchCard: true,
    scratchCardId: 'sc_01'
  },
  {
    id: 'tx_103',
    referenceId: 'FP-TXN-984198',
    type: 'recharge',
    category: 'recharge',
    title: 'Jio Prepaid 5G Plan (28 Days)',
    amount: 349,
    direction: 'debit',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    counterpartyName: 'Reliance Jio Infocomm',
    paymentMethod: 'HDFC Bank ••4821',
    flowCoinsEarned: 35
  },
  {
    id: 'tx_104',
    referenceId: 'FP-TXN-984180',
    type: 'bill_pay',
    category: 'electricity',
    title: 'Tata Power Electricity Bill',
    amount: 2150,
    direction: 'debit',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    counterpartyName: 'Tata Power - Mumbai',
    paymentMethod: 'HDFC Bank ••4821',
    hasScratchCard: true,
    scratchCardId: 'sc_02'
  },
  {
    id: 'tx_105',
    referenceId: 'FP-TXN-984165',
    type: 'add_wallet',
    category: 'transfer',
    title: 'Added to FlowPay Wallet',
    amount: 5000,
    direction: 'credit',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    counterpartyName: 'HDFC NetBanking',
    paymentMethod: 'HDFC Bank ••4821'
  },
  {
    id: 'tx_106',
    referenceId: 'FP-TXN-984150',
    type: 'cashback',
    category: 'cashback',
    title: 'Weekend Super Cashback',
    amount: 120,
    direction: 'credit',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    counterpartyName: 'FlowPay Rewards',
    paymentMethod: 'FlowPay Wallet'
  },
  {
    id: 'tx_107',
    referenceId: 'FP-TXN-984132',
    type: 'qr_pay',
    category: 'shopping',
    title: 'Zara Fashion Store',
    amount: 3499,
    direction: 'debit',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    counterpartyName: 'Zara Retail India',
    paymentMethod: 'FlowPay Wallet'
  },
  {
    id: 'tx_108',
    referenceId: 'FP-TXN-984110',
    type: 'bill_pay',
    category: 'broadband',
    title: 'Airtel Xstream Fiber',
    amount: 1179,
    direction: 'debit',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 160).toISOString(),
    counterpartyName: 'Bharti Airtel Broadband',
    paymentMethod: 'FlowPay Wallet'
  }
];

export const BILL_PROVIDERS: BillProvider[] = [
  {
    id: 'bp_elec_1',
    name: 'Tata Power Electricity',
    category: 'electricity',
    icon: 'Zap',
    color: '#F59E0B',
    sampleAccountPrompt: 'Consumer Number (12 Digits)',
    billDueAmount: 1840,
    dueDate: 'In 5 days'
  },
  {
    id: 'bp_elec_2',
    name: 'Adani Electricity Mumbai',
    category: 'electricity',
    icon: 'Zap',
    color: '#D97706',
    sampleAccountPrompt: 'Customer Account No. (9 Digits)'
  },
  {
    id: 'bp_water_1',
    name: 'Municipal Water Board',
    category: 'water',
    icon: 'Droplet',
    color: '#0284C7',
    sampleAccountPrompt: 'K-Number / Connection ID',
    billDueAmount: 430,
    dueDate: 'In 9 days'
  },
  {
    id: 'bp_gas_1',
    name: 'Mahanagar Gas (MGL)',
    category: 'gas',
    icon: 'Flame',
    color: '#EA580C',
    sampleAccountPrompt: 'BP Number (10 Digits)',
    billDueAmount: 890,
    dueDate: 'In 3 days'
  },
  {
    id: 'bp_gas_2',
    name: 'Indraprastha Gas Limited',
    category: 'gas',
    icon: 'Flame',
    color: '#C2410C',
    sampleAccountPrompt: 'Customer ID'
  },
  {
    id: 'bp_bb_1',
    name: 'Airtel Xstream Fiber',
    category: 'broadband',
    icon: 'Wifi',
    color: '#DC2626',
    sampleAccountPrompt: 'Landline / DSL Number',
    billDueAmount: 999,
    dueDate: 'Paid'
  },
  {
    id: 'bp_bb_2',
    name: 'JioFiber Broadband',
    category: 'broadband',
    icon: 'Wifi',
    color: '#2563EB',
    sampleAccountPrompt: 'Jio Fixed Voice Number'
  },
  {
    id: 'bp_land_1',
    name: 'BSNL Landline',
    category: 'landline',
    icon: 'PhoneCall',
    color: '#4F46E5',
    sampleAccountPrompt: 'Telephone Number with STD'
  },
  {
    id: 'bp_edu_1',
    name: 'National Public School',
    category: 'education',
    icon: 'GraduationCap',
    color: '#059669',
    sampleAccountPrompt: 'Student Enrollment ID'
  },
  {
    id: 'bp_ins_1',
    name: 'HDFC Life Insurance',
    category: 'insurance',
    icon: 'ShieldCheck',
    color: '#0D9488',
    sampleAccountPrompt: 'Policy Number (8 Digits)'
  },
  {
    id: 'bp_muni_1',
    name: 'Municipal Property Tax',
    category: 'municipal',
    icon: 'Building2',
    color: '#6366F1',
    sampleAccountPrompt: 'Property Tax Assessment ID'
  }
];

export const RECHARGE_PROVIDERS: RechargeProvider[] = [
  {
    id: 'rec_jio',
    name: 'Reliance Jio',
    type: 'mobile',
    icon: 'Radio',
    circle: 'Mumbai & Maharashtra',
    plans: [
      {
        id: 'p1',
        price: 349,
        validity: '28 Days',
        data: '2 GB/Day + 5G Unlimited',
        voice: 'Truly Unlimited',
        sms: '100 SMS/day',
        description: 'Includes JioCinema, JioCloud and 5G Welcome Offer.',
        tag: 'Trending'
      },
      {
        id: 'p2',
        price: 899,
        validity: '84 Days',
        data: '2 GB/Day + 5G Unlimited',
        voice: 'Truly Unlimited',
        sms: '100 SMS/day',
        description: 'Quarterly Best Value pack with high-speed 5G.',
        tag: 'Best Value'
      },
      {
        id: 'p3',
        price: 3599,
        validity: '365 Days',
        data: '2.5 GB/Day + 5G',
        voice: 'Unlimited',
        sms: '100 SMS/day',
        description: 'Annual full freedom pack with Amazon Prime Video subscription.',
        tag: 'Annual'
      },
      {
        id: 'p4',
        price: 198,
        validity: '14 Days',
        data: '2 GB/Day',
        voice: 'Unlimited',
        sms: '100 SMS/day',
        description: 'Budget short-term pack.'
      }
    ]
  },
  {
    id: 'rec_airtel',
    name: 'Bharti Airtel',
    type: 'mobile',
    icon: 'Antenna',
    circle: 'All Circles',
    plans: [
      {
        id: 'ap1',
        price: 379,
        validity: '1 Month',
        data: '2 GB/Day',
        voice: 'Unlimited',
        sms: '100 SMS/day',
        description: 'Free Hellotunes and Wynk Music included.',
        tag: 'Trending'
      },
      {
        id: 'ap2',
        price: 979,
        validity: '84 Days',
        data: '2 GB/Day + Unlimited 5G',
        voice: 'Truly Unlimited',
        sms: '100 SMS/day',
        description: 'Airtel Xstream Play subscription included.',
        tag: 'Best Value'
      }
    ]
  },
  {
    id: 'rec_vi',
    name: 'Vodafone Idea (Vi)',
    type: 'mobile',
    icon: 'Smartphone',
    circle: 'All India',
    plans: [
      {
        id: 'vp1',
        price: 365,
        validity: '28 Days',
        data: '2 GB/Day + Binge All Night',
        voice: 'Unlimited',
        sms: '100 SMS/day',
        description: 'Free 12am to 6am unlimited data.'
      }
    ]
  },
  {
    id: 'rec_dth_tata',
    name: 'Tata Play DTH',
    type: 'dth',
    icon: 'Tv',
    circle: 'Subscriber ID / Registered Mobile'
  },
  {
    id: 'rec_dth_airtel',
    name: 'Airtel Digital TV',
    type: 'dth',
    icon: 'Tv2',
    circle: 'Customer ID'
  },
  {
    id: 'rec_fastag_paytm',
    name: 'FASTag Recharge',
    type: 'fastag',
    icon: 'Car',
    circle: 'Vehicle Registration No.'
  },
  {
    id: 'rec_metro_delhi',
    name: 'Metro Card Smart Recharge',
    type: 'metro',
    icon: 'TrainTrack',
    circle: 'Smart Card (10 Digits)'
  }
];

export const GIFT_CARDS: GiftCardBrand[] = [
  {
    id: 'gc_amazon',
    name: 'Amazon Pay Gift Card',
    category: 'Shopping',
    logoText: 'Amazon',
    color: '#FF9900',
    discountPercentage: 2.5,
    denominations: [250, 500, 1000, 2000, 5000],
    cashbackOffer: 'Flat 2.5% Instant Cashback'
  },
  {
    id: 'gc_flipkart',
    name: 'Flipkart Voucher',
    category: 'Shopping',
    logoText: 'Flipkart',
    color: '#2874F0',
    discountPercentage: 3.0,
    denominations: [500, 1000, 2500, 5000],
    cashbackOffer: '3% Off with FlowPay Coins'
  },
  {
    id: 'gc_netflix',
    name: 'Netflix Subscription Card',
    category: 'Entertainment',
    logoText: 'Netflix',
    color: '#E50914',
    discountPercentage: 5.0,
    denominations: [649, 1000, 1999],
    cashbackOffer: 'Get 5% back in FlowCoins'
  },
  {
    id: 'gc_spotify',
    name: 'Spotify Premium Card',
    category: 'Entertainment',
    logoText: 'Spotify',
    color: '#1DB954',
    discountPercentage: 8.0,
    denominations: [299, 719, 1189],
    cashbackOffer: 'Extra 50 FlowCoins'
  },
  {
    id: 'gc_gaming',
    name: 'Google Play & Gaming Credits',
    category: 'Gaming',
    logoText: 'Play Store',
    color: '#0F9D58',
    discountPercentage: 4.0,
    denominations: [100, 300, 500, 1500],
    cashbackOffer: 'Instant Code Delivery'
  }
];

export const INITIAL_SCRATCH_CARDS: ScratchCard[] = [
  {
    id: 'sc_01',
    title: 'Blue Tokai Coffee Reward',
    subtitle: 'Scratch to reveal your cashback!',
    rewardType: 'cashback',
    rewardValue: 48,
    isScratched: false,
    color: '#2563EB'
  },
  {
    id: 'sc_02',
    title: 'Tata Power Payment Bonus',
    subtitle: 'You unlocked a power saver gift!',
    rewardType: 'cashback',
    rewardValue: 75,
    isScratched: false,
    color: '#059669'
  },
  {
    id: 'sc_03',
    title: 'FlowCoins Surprise Pack',
    subtitle: 'Coins to redeem gift cards!',
    rewardType: 'coins',
    rewardValue: 250,
    isScratched: true,
    scratchedAt: '2 days ago',
    color: '#D97706'
  },
  {
    id: 'sc_04',
    title: 'Swiggy Gourmet Feast Coupon',
    subtitle: '60% OFF up to ₹150',
    rewardType: 'voucher',
    rewardValue: 150,
    voucherCode: 'FLOWSWIGGY150',
    isScratched: true,
    scratchedAt: '5 days ago',
    color: '#EA580C'
  }
];

export const REWARD_COUPONS: RewardCoupon[] = [
  {
    id: 'cp_1',
    brand: 'Swiggy Gourmet',
    title: 'Flat ₹120 OFF on orders above ₹399',
    code: 'FLOWSWIGGY120',
    discount: '₹120 OFF',
    expiresIn: 'Valid till 30 Sep',
    category: 'Food',
    color: '#FC8019'
  },
  {
    id: 'cp_2',
    brand: 'Myntra Fashion',
    title: 'Extra 15% OFF on top brands',
    code: 'FLOWMYNTRA15',
    discount: '15% OFF',
    expiresIn: 'Valid till 15 Oct',
    category: 'Shopping',
    color: '#E11D48'
  },
  {
    id: 'cp_3',
    brand: 'MakeMyTrip Hotels',
    title: 'Up to ₹1,500 Instant Discount',
    code: 'FLOWMMTDOM',
    discount: '₹1500 OFF',
    expiresIn: 'Valid till 31 Oct',
    category: 'Travel',
    color: '#2563EB'
  },
  {
    id: 'cp_4',
    brand: 'Cult.fit Fitness',
    title: 'Free 14-Day Gym Access Pass',
    code: 'FLOWCULT14',
    discount: '100% OFF',
    expiresIn: 'Valid till 20 Oct',
    category: 'Health',
    color: '#10B981'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_1',
    title: 'First Flow',
    description: 'Complete your first digital payment with FlowPay',
    icon: 'Sparkles',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    badge: 'Bronze Payer'
  },
  {
    id: 'ach_2',
    title: 'Lightning Scanner',
    description: 'Scan & Pay via merchant QR 5 times',
    icon: 'QrCode',
    unlocked: true,
    progress: 5,
    maxProgress: 5,
    badge: 'QR Master'
  },
  {
    id: 'ach_3',
    title: 'Super Saver',
    description: 'Earn over ₹500 in cashbacks & coins',
    icon: 'Coins',
    unlocked: true,
    progress: 680,
    maxProgress: 500,
    badge: 'Gold Saver'
  },
  {
    id: 'ach_4',
    title: 'Bill Buster',
    description: 'Pay 10 utility bills without missing a due date',
    icon: 'ShieldCheck',
    unlocked: false,
    progress: 6,
    maxProgress: 10,
    badge: 'Punctual Pro'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'payment_success',
    title: 'Payment Successful',
    message: '₹750 transferred to Priya Patel with reference FP-TXN-984210.',
    timestamp: '35 mins ago',
    read: false
  },
  {
    id: 'notif_2',
    type: 'offer_alert',
    title: '🎁 Scratch Card Unlocked!',
    message: 'You unlocked a brand new scratch card on your Blue Tokai Coffee order.',
    timestamp: '3 hours ago',
    read: false
  },
  {
    id: 'notif_3',
    type: 'recharge_reminder',
    title: 'Mahanagar Gas Bill Due in 3 Days',
    message: 'Bill of ₹890 is pending. Pay before 8 Sep to avoid late fees.',
    timestamp: '1 day ago',
    read: true
  },
  {
    id: 'notif_4',
    type: 'security_alert',
    title: 'Biometric Access Enabled',
    message: 'Fingerprint and Face ID unlock successfully configured for FlowPay.',
    timestamp: '2 days ago',
    read: true
  },
  {
    id: 'notif_5',
    type: 'promotions',
    title: 'Weekend 10% Gold Rush Cashback',
    message: 'Recharge your FASTag or Metro Card and earn 10% FlowCoins back.',
    timestamp: '3 days ago',
    read: true
  }
];

export const MERCHANT_DATA: MerchantData = {
  id: 'mch_001',
  storeName: 'Metro Gourmet Mart & Cafe',
  merchantUpi: 'metro.grocers@flowpay',
  category: 'Retail & Dining',
  terminalId: 'FP-POS-7719',
  qrCodeUrl: 'flowpay://pay?pa=metro.grocers@flowpay&pn=Metro%20Gourmet%20Mart&cu=INR',
  todayRevenue: 28450,
  weeklyRevenue: 184300,
  monthlyRevenue: 742100,
  customerCountToday: 84,
  settlementPending: 28450,
  recentPayments: [
    {
      id: 'mp_1',
      customerName: 'Rahul Sharma',
      customerPhone: '+91 98765 43210',
      amount: 320,
      timestamp: '15 mins ago',
      status: 'received'
    },
    {
      id: 'mp_2',
      customerName: 'Ananya Roy',
      customerPhone: '+91 99123 44556',
      amount: 1450,
      timestamp: '42 mins ago',
      status: 'received'
    },
    {
      id: 'mp_3',
      customerName: 'Devendra Singh',
      customerPhone: '+91 98221 33441',
      amount: 680,
      timestamp: '1 hour ago',
      status: 'received'
    },
    {
      id: 'mp_4',
      customerName: 'Kavita Rao',
      customerPhone: '+91 97110 55432',
      amount: 2100,
      timestamp: '2 hours ago',
      status: 'settled'
    }
  ],
  topCustomers: [
    { name: 'Rahul Sharma', phone: '+91 98765 43210', visits: 18, totalSpent: 8940 },
    { name: 'Kavita Rao', phone: '+91 97110 55432', visits: 14, totalSpent: 12400 },
    { name: 'Devendra Singh', phone: '+91 98221 33441', visits: 11, totalSpent: 6200 },
    { name: 'Priya Patel', phone: '+91 98234 11223', visits: 9, totalSpent: 4850 }
  ]
};

export const ADMIN_METRICS: AdminMetrics = {
  dailyActiveUsers: 48250,
  monthlyActiveUsers: 842100,
  totalGmv: 42890500,
  totalTransactionsCount: 298410,
  successRate: 99.82,
  avgTransactionValue: 485,
  retentionRate: 88.4,
  csatScore: 4.8,
  walletFloatBalance: 12500000,
  systemHealth: 'Optimal'
};
