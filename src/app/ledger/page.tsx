"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';


const formatCurrency = (amount: number | null | undefined, currency: string = 'USD') => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '-';
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
};


// Mock data - replace with API call
const mockLedgerEntries = [
    { date: '2024-07-01', description: 'Opening Balance', debit: null, credit: null, balance: 145000.00 },
    { date: '2024-07-15', description: 'Payment from Customer A', debit: 15000.00, credit: null, balance: 160000.00 },
    { date: '2024-07-22', description: 'Salary Payments', debit: null, credit: 30000.00, balance: 130000.00 },
    { date: '2024-07-28', description: 'Payment to Supplier B', debit: null, credit: 25000.00, balance: 105000.00 },
];

const GeneralLedgerPage = () => {
  const [ledgerEntries, setLedgerEntries] = useState(mockLedgerEntries);
  const [selectedAccount, setSelectedAccount] = useState('1010');
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2024, 6, 1),
    to: addDays(new Date(2024, 6, 31), 0),
  })

  const endingBalance = ledgerEntries.length > 0 ? ledgerEntries[ledgerEntries.length - 1].balance : 0;

  return (
    <div className="container mx-auto p-4 md:p-8">
        <Card className="max-w-5xl mx-auto">
            <CardHeader>
                <CardTitle>General Ledger</CardTitle>
                <CardDescription>
                    View the detailed transaction history for any account.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 border rounded-lg items-end bg-muted/20">
                    <div className="flex-1 space-y-2">
                        <label htmlFor="account-select" className="font-semibold text-sm">Account</label>
                        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                            <SelectTrigger id="account-select">
                                <SelectValue placeholder="Select an account..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1010">1010 - Cash at Bank</SelectItem>
                                <SelectItem value="1100">1100 - Accounts Receivable</SelectItem>
                                <SelectItem value="2000">2000 - Accounts Payable</SelectItem>
                                <SelectItem value="4010">4010 - Product Sales</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                         <label htmlFor="date-range" className="font-semibold text-sm">Date Range</label>
                         <DateRangePicker date={dateRange} onDateChange={setDateRange} id="date-range"/>
                    </div>
                    <div className="self-end">
                        <Button>View Ledger</Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Account: 1010 - Cash at Bank</CardTitle>
                        <CardDescription>
                            Transactions from {dateRange?.from ? format(dateRange.from, 'LLL dd, y') : ''} to {dateRange?.to ? format(dateRange.to, 'LLL dd, y') : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Debit</TableHead>
                                    <TableHead className="text-right">Credit</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ledgerEntries.map((entry, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{format(new Date(entry.date), 'dd-MM-yyyy')}</TableCell>
                                        <TableCell>{entry.description}</TableCell>
                                        <TableCell className="text-right font-mono">{formatCurrency(entry.debit)}</TableCell>
                                        <TableCell className="text-right font-mono">{formatCurrency(entry.credit)}</TableCell>
                                        <TableCell className="text-right font-mono font-semibold">{formatCurrency(entry.balance)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4} className="text-right font-bold">Ending Balance</TableCell>
                                    <TableCell className="text-right font-bold font-mono">{formatCurrency(endingBalance)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>

            </CardContent>
        </Card>
    </div>
  );
};

export default GeneralLedgerPage;
