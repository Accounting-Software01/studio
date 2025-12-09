'use server';

import { chartOfAccounts } from '@/lib/chart-of-accounts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const API_BASE_URL = 'https://hariindustries.net/busa-api/database';

// Helper to format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
};


// Fetch Overview Data
export async function getDashboardOverview() {
    try {
        const toDate = new Date();
        const fromDate = new Date(toDate.getFullYear(), 0, 1); // Start of the year

        const toDateStr = format(toDate, 'yyyy-MM-dd');
        const fromDateStr = format(fromDate, 'yyyy-MM-dd');
        
        // --- Fetch data for all metrics in parallel ---
        const [bsRes, plRes, cashRes] = await Promise.all([
            fetch(`${API_BASE_URL}/balance-sheet.php?fromDate=${fromDateStr}&toDate=${toDateStr}`),
            fetch(`${API_BASE_URL}/profit-loss.php?fromDate=${fromDateStr}&toDate=${toDateStr}`),
            fetch(`${API_BASE_URL}/general-ledger.php?accountId=101100&fromDate=${fromDateStr}&toDate=${toDateStr}`) // Main bank account for cash balance
        ]);

        if (!bsRes.ok || !plRes.ok || !cashRes.ok) {
            // Log more details for debugging
            if (!bsRes.ok) console.error("Balance Sheet fetch failed:", bsRes.statusText);
            if (!plRes.ok) console.error("Profit/Loss fetch failed:", plRes.statusText);
            if (!cashRes.ok) console.error("Cash Ledger fetch failed:", cashRes.statusText);
            throw new Error('Failed to fetch one or more dashboard metrics.');
        }

        const bsData = await bsRes.json();
        const plData = await plRes.json();
        const cashData = await cashRes.json();
        
        // --- Calculate metrics ---
        
        // Total Revenue & Net Profit
        let totalRevenue = 0;
        let totalExpenses = 0;
        plData.forEach((item: any) => {
            const account = chartOfAccounts.find(acc => acc.code === item.accountId);
            if (!account) return;
            const balance = parseFloat(item.balance);
            if (account.type === 'Revenue') {
                totalRevenue += balance;
            } else if (account.type === 'Expense') {
                totalExpenses += -balance; // balance is credit-debit, so it's negative for expenses
            }
        });
        const netProfit = totalRevenue - totalExpenses;

        // Total Assets
        let totalAssets = 0;
        if(bsData.balances) {
             for (const accountId in bsData.balances) {
                const account = chartOfAccounts.find(acc => acc.code === accountId);
                if (account && account.type === 'Asset') {
                    totalAssets += parseFloat(bsData.balances[accountId]);
                }
            }
        }

        // Cash Balance
        const cashBalance = cashData.length > 0 ? cashData[cashData.length - 1].balance : 0;

        return {
            totalRevenue: formatCurrency(totalRevenue),
            netProfit: formatCurrency(netProfit),
            totalAssets: formatCurrency(totalAssets),
            cashBalance: formatCurrency(cashBalance)
        };

    } catch (error: any) {
        console.error('Error fetching dashboard overview:', error);
        throw new Error('Could not fetch dashboard overview data.');
    }
}

// Fetch Recent Activities
export async function getRecentActivities() {
    try {
        const toDate = format(new Date(), 'yyyy-MM-dd');
        // Look back 3 months for recent activity
        const fromDate = format(subMonths(new Date(), 3), 'yyyy-MM-dd'); 

        const res = await fetch(`${API_BASE_URL}/recent-transactions.php?fromDate=${fromDate}&toDate=${toDate}`);
        
        if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}`);
        }

        const data = await res.json();
        
        if(data.error) {
            throw new Error(data.error);
        }

        // We only want to show a few recent transactions
        return data.slice(0, 5).map((activity: any) => ({
            ...activity,
            amount: formatCurrency(parseFloat(activity.amount))
        }));

    } catch (error: any) {
        console.error('Error fetching recent activities:', error);
        throw new Error('Could not fetch recent activities.');
    }
}
