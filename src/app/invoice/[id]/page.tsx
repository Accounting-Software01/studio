
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer, RefreshCw, Info, Loader2 } from 'lucide-react';
import type { Invoice, LedgerAccount, CompanyDetails } from '@/types';
import { format, isValid, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { chartOfAccounts } from '@/lib/chart-of-accounts';

const defaultCompanyDetails: CompanyDetails = {
    name: "HARI INDUSTRIES & TRADING LTD",
    address: "Head Office: 23, Ojo-Alaba International Market, Ojo, Lagos State, Nigeria.",
    phone: "+234 8093939368, 08125293535",
    email: "billing@hariindustries.ng, contact@hariindustries.ng",
    website: "www.hariindustries.net",
    logoUrl: "/hari logo-01.png"
};

// New function to get customer balance
const getCustomerBalance = async (customerId: string) => {
    const url = new URL('https://hariindustries.net/busa-api/database/general-ledger.php');
    url.searchParams.append('accountId', customerId);
    // Use a wide date range to get the all-time balance
    url.searchParams.append('fromDate', '1970-01-01');
    url.searchParams.append('toDate', format(new Date(), 'yyyy-MM-dd'));

    const res = await fetch(url.toString());
    const data = await res.json();
    if (data && data.length > 0) {
        return data[data.length - 1].balance; // The last entry has the final balance
    }
    return 0;
};


export default function InvoiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [customerBalance, setCustomerBalance] = useState<number | null>(null);
    const [company] = useState<CompanyDetails>(defaultCompanyDetails);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const logoPath = "/hari logo-01.png";

    const invoiceId = params.id as string;

    const fetchInvoiceData = useCallback(async () => {
        if (!invoiceId) return;
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`https://hariindustries.net/busa-api/database/get_invoice.php?id=${invoiceId}`);
            if (!res.ok) {
                const errorJson = await res.json().catch(() => ({}));
                throw new Error(errorJson.message || `Failed to fetch invoice: ${res.status}`);
            }
            const result = await res.json();

            if (result.success && result.data) {
                const invoiceData = result.data;
                const customerAccount = chartOfAccounts.find(acc => acc.code === invoiceData.customerId);
                
                const parsedData: Invoice = {
                    ...invoiceData,
                    issueDate: parseISO(invoiceData.issueDate),
                    dueDate: parseISO(invoiceData.dueDate),
                    subTotal: parseFloat(invoiceData.subTotal),
                    taxAmount: parseFloat(invoiceData.taxAmount || 0),
                    totalAmount: parseFloat(invoiceData.totalAmount),
                    customerName: customerAccount?.name || 'Unknown Customer',
                    items: (invoiceData.items || []).map((item: any) => ({
                        ...item,
                        totalPrice: parseFloat(item.totalPrice)
                    })),
                };
                setInvoice(parsedData);

                if (parsedData.customerId) {
                    const balance = await getCustomerBalance(parsedData.customerId);
                    setCustomerBalance(balance);
                }

            } else {
                throw new Error(result.message || 'Invoice not found.');
            }
        } catch (err: any) {
            console.error("Fetch Error:", err);
            setError(err.message);
            toast({ title: 'Error Fetching Data', description: err.message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }, [invoiceId, toast]);

    useEffect(() => {
        fetchInvoiceData();
    }, [fetchInvoiceData]);

    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return 'N/A';
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    const formatDate = (date: Date | string | number | null) => {
        if (!date) return 'N/A';
        const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
        return isValid(d) ? format(d, 'PPP') : 'Invalid Date';
    };
    
    const previousBalance = customerBalance !== null && invoice ? customerBalance - invoice.totalAmount : null;
    const newBalance = customerBalance;


    if (isLoading) {
        return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (error) {
        return (
            <div className="text-center py-10 px-4">
                <Info className="mx-auto h-12 w-12 text-red-500" />
                <h2 className="mt-4 text-xl font-semibold">Failed to load invoice</h2>
                <p className="mt-2 text-muted-foreground">{error}</p>
                <Button onClick={fetchInvoiceData} className="mt-6">Try Again</Button>
            </div>
        );
    }

    if (!invoice) {
        return <div className="text-center py-10">Invoice not found or data is invalid.</div>;
    }

    return (
        <div className="bg-background">
            <style jsx global>{`
                @media print {
                    body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; background-color: #ffffff !important; }
                    .printable-area { margin: 0 !important; padding: 0 !important; box-shadow: none !important; border: none !important; background-color: #ffffff !important; }
                    .no-print { display: none !important; }
                    .print-text-black, .print-text-black * { color: #000000 !important; }
                    .print-border-black { border-color: #000000 !important; }
                    @page { size: A4; margin: 15mm; }
                }
            `}</style>
            
            <div className="max-w-4xl mx-auto bg-card p-4 sm:p-8 rounded-lg shadow-lg my-8 printable-area print-text-black">
                <header className="mb-8">
                    <div className="flex justify-between items-start border-b-2 border-black pb-4 print-border-black">
                        <div className="w-2/3">
                            <div className="mb-4">
                                <Image src={logoPath} alt="Company Logo" width={120} height={40} className="object-contain" unoptimized />
                            </div>
                            <h1 className="text-xl font-bold uppercase print-text-black">{company.name}</h1>
                            <p className="text-sm print-text-black">{company.address}</p>
                        </div>
                        <div className="w-1/3 text-right">
                            <h2 className="text-3xl font-bold uppercase text-gray-700 print-text-black">Invoice</h2>
                            <p className="text-sm text-gray-500 print-text-black"># {invoice.invoiceNumber}</p>
                            <Badge className={`mt-2 ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{invoice.status}</Badge>
                        </div>
                    </div>
                </header>

                <section className="mb-8">
                    <div className="grid grid-cols-2 gap-4">
                         <div className="text-sm">
                            <h3 className="font-semibold mb-2 text-base">Billed To:</h3>
                            <p className="font-bold text-gray-800 print-text-black">{invoice.customerName}</p>
                            <p>{invoice.customerAddress}</p>
                            <p>{invoice.customerEmail}</p>
                        </div>
                        <div className="text-sm text-right">
                            <div className="mb-2"><span className="font-semibold">Invoice Date: </span><span>{formatDate(invoice.issueDate)}</span></div>
                            <div><span className="font-semibold">Due Date: </span><span>{formatDate(invoice.dueDate)}</span></div>
                        </div>
                    </div>
                </section>

                <section>
                    <Table className="invoice-table w-full text-sm">
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-1/2 font-bold text-black border print-text-black">Item Description</TableHead>
                                <TableHead className="text-right font-bold text-black border print-text-black">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoice.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="border">{chartOfAccounts.find(acc => acc.code === item.productId)?.name || item.productName}</TableCell>
                                    <TableCell className="text-right border">{formatCurrency(item.totalPrice)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>

                <section className="mt-8 flex justify-end">
                    <div className="w-full max-w-sm text-sm space-y-2">
                        <div className="flex justify-between"><span className="font-semibold">Subtotal:</span><span>{formatCurrency(invoice.subTotal)}</span></div>
                        {invoice.taxAmount && invoice.taxAmount > 0 && (
                            <div className="flex justify-between"><span className="font-semibold">VAT (7.5%):</span><span>{formatCurrency(invoice.taxAmount)}</span></div>
                        )}
                        <div className="border-t-2 border-black my-2 print-border-black"></div>
                        <div className="flex justify-between font-bold text-base"><span className="font-semibold">Invoice Total:</span><span>{formatCurrency(invoice.totalAmount)}</span></div>
                         {previousBalance !== null && (
                            <div className="flex justify-between border-t border-dashed pt-2"><span className="text-gray-600">Previous Balance:</span><span className="text-gray-600">{formatCurrency(previousBalance)}</span></div>
                        )}
                         {newBalance !== null && (
                             <div className="flex justify-between font-bold text-base py-1"><span className="font-semibold">New Balance Due:</span><span className="text-red-600">{formatCurrency(newBalance)}</span></div>
                        )}
                    </div>
                </section>

                {invoice.notes && (
                    <section className="mt-8 pt-4 border-t print-border-black">
                         <h3 className="font-semibold mb-2">Notes:</h3>
                         <p className="text-xs text-gray-600 print-text-black whitespace-pre-wrap">{invoice.notes}</p>
                    </section>
                )}
                 <footer className="mt-12 pt-4 text-center text-xs text-gray-500 border-t print-border-black">
                    <p>Thank you for your business!</p>
                    <p>Please make all payments to the account details provided separately.</p>
                </footer>
            </div>
             <div className="mt-6 flex justify-center gap-2 no-print mb-8">
                 <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
                 <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4"/> Print Invoice</Button>
            </div>
        </div>
    );
}
