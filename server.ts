import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'FlowPay Super App Server',
      timestamp: new Date().toISOString(),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI Finance Assistant endpoint
  app.post('/api/ai/finance-chat', async (req, res) => {
    try {
      const { message, transactionContext, userContext } = req.body;
      const query = (message || '').trim();

      if (!query) {
        return res.status(400).json({ error: 'Message cannot be empty' });
      }

      const client = getGeminiClient();

      if (client) {
        const systemPrompt = `You are FlowPay's AI Finance Assistant, a modern, highly intelligent, and friendly financial advisor embedded inside the FlowPay Digital Payments & Super App.
Current User Context:
- Name: ${userContext?.name || 'Rahul Sharma'}
- Current Wallet Balance: ₹${userContext?.walletBalance || 8450}
- Current Month Total Spending: ₹${userContext?.currentMonthSpend || 11240}
- Monthly Budget Limit: ₹${userContext?.monthlySpendLimit || 25000}
- FlowCoins: ${userContext?.flowCoins || 1280}

Recent Transactions Context:
${JSON.stringify(transactionContext || [], null, 2)}

Instructions:
1. Answer the user's financial question directly, warmly, and concisely.
2. If asked "Where did I spend the most?", analyze the highest expenditure categories (e.g. Shopping, Utilities, Dining).
3. If asked "Monthly expenses?" or "How much did I save?", summarize the metrics and savings accurately.
4. If asked "Suggest budget", provide practical 50/30/20 or personalized percentage allocations.
5. Provide a helpful JSON block at the end if suitable for charts in this exact format:
\`\`\`chart
{"type":"pie","labels":["Shopping","Utilities","Food & Dining","Recharge","Transfers"],"values":[3499,3329,320,349,750]}
\`\`\`
Keep the response crisp, professional, formatting with clean Markdown bullets.`;

        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: query,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });

        const rawText = response.text || '';
        let chartData: { type: 'pie' | 'bar'; labels: string[]; values: number[] } | undefined;
        let cleanedText = rawText;

        const chartMatch = rawText.match(/```chart\s*([\s\S]*?)\s*```/);
        if (chartMatch && chartMatch[1]) {
          try {
            chartData = JSON.parse(chartMatch[1]);
            cleanedText = rawText.replace(/```chart\s*[\s\S]*?\s*```/, '').trim();
          } catch {
            // chart parse failed, keep text
          }
        }

        return res.json({
          reply: cleanedText,
          chartData,
          engine: 'Gemini 3.8 Flash',
        });
      } else {
        // High quality deterministic fallback when API key is pending
        let reply = '';
        let chartData: { type: 'pie' | 'bar'; labels: string[]; values: number[] } | undefined;

        const lower = query.toLowerCase();
        if (lower.includes('spend the most') || lower.includes('highest')) {
          reply = `### Top Spending Categories This Month\n\nBased on your recent transactions, your highest expenditure was in **Shopping** (Zara - ₹3,499) and **Utility Bills** (Tata Power & Airtel Fiber - ₹3,329 total).\n\n- **Shopping**: ₹3,499 (41%)\n- **Utilities & Bills**: ₹3,329 (39%)\n- **Transfers & P2P**: ₹750 (9%)\n- **Mobile & Recharges**: ₹349 (4%)\n- **Dining & Coffee**: ₹320 (4%)\n\n💡 *Tip: You have used 45% of your ₹25,000 monthly spending limit. You are well on track!*`;
          chartData = {
            type: 'pie',
            labels: ['Shopping', 'Utilities', 'Transfers', 'Recharges', 'Food/Coffee'],
            values: [3499, 3329, 750, 349, 320],
          };
        } else if (lower.includes('monthly expenses') || lower.includes('expenses')) {
          reply = `### Monthly Spending Overview\n\n- **Total Spent This Month**: ₹11,240\n- **Monthly Budget**: ₹25,000\n- **Remaining Budget**: ₹13,760\n- **Daily Average**: ₹374.60\n\nYour spending velocity dropped by **14% compared to last week**, giving you an estimated end-of-month buffer of ₹4,200.`;
          chartData = {
            type: 'bar',
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4 (Est.)'],
            values: [3200, 4100, 3940, 2800],
          };
        } else if (lower.includes('save') || lower.includes('savings')) {
          reply = `### Savings & Cashback Analysis\n\nThrough FlowPay Cashbacks and Smart Bill payments, you have saved:\n\n- **Direct Cashback**: ₹183 credited to wallet\n- **FlowCoins Earned**: 1,280 FlowCoins (~₹128 value)\n- **Discount Coupons Redeemed**: ₹240\n- **Total Savings This Month**: **₹551**\n\n🚀 You're ranked in the top 15% of smart savers this cycle!`;
        } else if (lower.includes('budget') || lower.includes('suggest')) {
          reply = `### Recommended 50/30/20 Smart Budget Plan\n\nFor your monthly income profile:\n\n1. **Needs (50%) - ₹20,000**: Rent, Electricity, Broadband, Groceries\n2. **Wants (30%) - ₹12,000**: Dining out, shopping, subscriptions\n3. **Savings & Investments (20%) - ₹8,000**: Liquid funds, auto-deposit to high-yield account\n\n💡 *Enable 'Auto-Save Roundup' in Profile Settings to round up every payment to the nearest ₹10 and stash the change!*`;
          chartData = {
            type: 'pie',
            labels: ['Needs (50%)', 'Wants (30%)', 'Savings (20%)'],
            values: [20000, 12000, 8000],
          };
        } else {
          reply = `### Financial Insights for You\n\nI reviewed your latest activity:\n- Your wallet balance is healthy at **₹${userContext?.walletBalance || 8450}**.\n- You have **1 pending bill**: Mahanagar Gas (₹890) due in 3 days.\n- You earned **48 Cashback** on your last coffee purchase.\n\nAsk me anything like *"Where did I spend the most?"*, *"How much did I save?"*, or *"Suggest budget"*!`;
        }

        return res.json({
          reply,
          chartData,
          engine: 'FlowPay Financial Intelligence Engine',
        });
      }
    } catch (error: any) {
      console.error('Error in /api/ai/finance-chat:', error);
      res.status(500).json({
        error: 'Failed to generate financial analysis',
        details: error?.message,
      });
    }
  });

  // Simulated OTP sender / verification
  app.post('/api/auth/send-otp', (req, res) => {
    const { phone } = req.body;
    res.json({
      success: true,
      message: `OTP sent successfully to ${phone || 'your mobile number'}`,
      demoOtp: '1234',
    });
  });

  // Export CSV of transactions
  app.get('/api/transactions/export-csv', (_req, res) => {
    const csvHeader = 'Reference ID,Date,Type,Category,Title,Amount,Direction,Status,Counterparty\n';
    const sampleRows = [
      'FP-TXN-984210,2026-09-05T18:30:00Z,transfer,transfer,Sent to Priya Patel,750,debit,success,Priya Patel',
      'FP-TXN-984209,2026-09-05T16:05:00Z,qr_pay,food,Blue Tokai Coffee,320,debit,success,Blue Tokai Merchant',
      'FP-TXN-984198,2026-09-04T11:20:00Z,recharge,recharge,Jio Prepaid 5G,349,debit,success,Reliance Jio',
      'FP-TXN-984180,2026-09-03T09:15:00Z,bill_pay,electricity,Tata Power Electricity,2150,debit,success,Tata Power',
      'FP-TXN-984165,2026-09-02T14:40:00Z,add_wallet,transfer,Added to Wallet,5000,credit,success,HDFC Bank',
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="FlowPay_Transactions_Statement.csv"');
    res.send(csvHeader + sampleRows);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FlowPay Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
