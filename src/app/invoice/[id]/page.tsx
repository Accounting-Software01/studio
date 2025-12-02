'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Invoice } from '@/types';
import { format, isValid, parseISO } from 'date-fns';
import { Loader2, ArrowLeft, Printer, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { ToWords } from "to-words";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const toWords = new ToWords({
    localeCode: "en-NG",
    converterOptions: {
        currency: false,
    },
});

const convertAmountToWords = (amount: number) => {
    if (!amount || isNaN(amount)) return "";
    try {
      const words = toWords.convert(amount);
      return words.charAt(0).toUpperCase() + words.slice(1) + " Naira Only";
    } catch (error) {
      console.error("Error converting amount to words:", error);
      return "Invalid amount";
    }
};

const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(0);
    }
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

const logo = PlaceHolderImages.find(img => img.id === 'company-logo');

const InvoicePage = () => {
    const { id: invoiceId } = useParams();
    const router = useRouter();
    const { toast } = useToast();

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [printedDate, setPrintedDate] = useState('');

    useEffect(() => {
        setPrintedDate(format(new Date(), 'dd-MM-yyyy'));
    }, []);

    const fetchInvoice = useCallback(async () => {
        if (!invoiceId) return;
        setIsLoading(true);
        try {
            const response = await fetch(`https://hariindustries.net/busa-api/database/get_invoice.php?id=${invoiceId}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.success && result.data) {
                setInvoice(result.data);
            } else {
                throw new Error(result.message || "Failed to fetch invoice details.");
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [invoiceId, toast]);

    useEffect(() => {
        fetchInvoice();
    }, [fetchInvoice]);

    const handlePrint = () => {
        window.print();
    };

    const formatDateSafe = (dateString: string | undefined | null) => {
        if (!dateString) return 'N/A';
        try {
            const date = parseISO(dateString);
            return isValid(date) ? format(date, 'dd-MM-yyyy') : 'N/A';
        } catch {
            return 'N/A';
        }
    }
    
    const getDeliveryNote = (invoiceNum: string) => {
        if (!invoiceNum) return 'N/A';
        const parts = invoiceNum.split('/');
        return parts.length > 2 ? `ANLDN/${parts[1]}/${parts[2]}`: 'N/A';
    }

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    if (!invoice) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <div className="w-full max-w-md text-center p-8 bg-card rounded-lg shadow-md">
                    <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                    <h2 className="mt-4 text-2xl font-bold">Invoice Not Found</h2>
                    <p className="mt-2 text-muted-foreground">The invoice you are looking for could not be found or failed to load.</p>
                    <Button onClick={() => router.back()} className="mt-6 w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const company = invoice.companyDetails;
    const customer = invoice.customer;
    const balances = invoice.balances;

    return (
        <div className="bg-background p-4 sm:p-8 font-body">
            <style jsx global>{`
                @media print {
                    body {
                        background-color: #fff !important;
                    }
                    .printable-area {
                        margin: 0;
                        padding: 0;
                        box-shadow: none;
                        border: none;
                    }
                    .no-print {
                        display: none !important;
                    }
                    @page {
                        size: A4;
                        margin: 20mm;
                    }
                }
                .invoice-table th, .invoice-table td {
                    border: 1px solid #e5e7eb;
                    padding: 0.5rem;
                }
            `}</style>
            
            <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-lg printable-area">
                <header className="mb-8">
                    <div className="flex justify-between items-start border-b-2 border-black pb-4">
                        <div className="w-1/2">
                            {logo && (
                                <div className="mb-4">
                                    <Image
                                        src={logo.imageUrl}
                                        alt="Company Logo"
                                        width={120}
                                        height={40}
                                        className="object-contain"
                                        data-ai-hint={logo.imageHint}
                                    />
                                </div>
                            )}
                            <h1 className="text-xl font-bold">{company.name}</h1>
                            <p className="text-sm">{company.address}</p>
                            <p className="text-sm">+234 8093939368, 08125293535</p>
                            <p className="text-sm">billing@hariindustries.ng, contact@hariindustries.ng</p>
                            <p className="text-sm">www.hariindustries.net</p>
                        </div>
                        <div className="w-1/2 text-right">
                             <h2 className="text-2xl font-bold uppercase">Sales Invoice</h2>
                             <p className="text-xs text-muted-foreground">Printed by: Management on {printedDate} (Original)</p>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 text-sm">
                        <div className="w-1/2">
                            <p className="font-bold">Buyer</p>
                            <p>{customer.name}</p>
                        </div>
                        <div className="w-1/2">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 border p-2 rounded-md">
                                <div><span className="font-semibold">Invoice No:</span></div>
                                <div>{invoice.invoiceNumber}</div>
                                <div><span className="font-semibold">Dated:</span></div>
                                <div>{formatDateSafe(invoice.issueDate)}</div>
                                
                                <div><span className="font-semibold">Delivery Note:</span></div>
                                <div>{getDeliveryNote(invoice.invoiceNumber)}</div>
                                <div><span className="font-semibold">Dated:</span></div>
                                <div>{formatDateSafe(invoice.issueDate)}</div>

                                <div><span className="font-semibold">Destination:</span></div>
                                <div>SOKOTO</div>
                            </div>
                        </div>
                    </div>
                </header>

                <main>
                    <table className="w-full text-sm text-left invoice-table border-collapse">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="w-12">S.No</th>
                                <th className="w-1/2">Item Description</th>
                                <th>Quantity</th>
                                <th>Rate</th>
                                <th>Per</th>
                                <th className="text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="text-center">{index + 1}</td>
                                    <td>{item.productName}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-right">{formatCurrency(item.unitPrice).replace('₦', '')}</td>
                                    <td className="text-center">{item.unitOfMeasure}</td>
                                    <td className="text-right font-medium">{formatCurrency(item.totalPrice).replace('₦', '')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end mt-4">
                        <div className="w-2/5 space-y-2 text-sm">
                            <div className="flex justify-between border-t pt-2">
                                <span>Subtotal:</span>
                                <span className="font-medium">{formatCurrency(invoice.subTotal)}</span>
                            </div>
                            {invoice.discountAmount !== null && invoice.discountAmount > 0 && (
                                <div className="flex justify-between">
                                    <span>Discount:</span>
                                    <span>- {formatCurrency(invoice.discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>VAT (7.5%):</span>
                                <span>{formatCurrency(invoice.taxAmount)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold border-t-2 border-black pt-2">
                                <span>TOTAL:</span>
                                <span>{formatCurrency(invoice.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </main>
                
                <footer className="mt-12 text-sm">
                    <div className="border-t border-b py-2">
                        <p>
                            <span className="font-semibold">Amount In Words:</span>{" "}
                            {convertAmountToWords(invoice.totalAmount)}
                        </p>
                    </div>

                     <div className="mt-4 border p-4 bg-muted/50 rounded-md">
                        <h4 className="font-bold text-base mb-2">Account Summary</h4>
                        <div className="grid grid-cols-2 gap-x-4">
                            <div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Previous Balance:</span>
                                    <span className="font-medium">{formatCurrency(balances?.previousBalance)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">This Invoice:</span>
                                    <span className="font-medium">{formatCurrency(invoice.totalAmount)}</span>
                                </div>
                            </div>
                             <div>
                                <div className="flex justify-between font-bold text-lg">
                                     <span className="text-gray-800">New Balance:</span>
                                    <span className="text-primary">{formatCurrency(balances?.newBalance)}</span>
                                </div>
                             </div>
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <p className="font-semibold">Narration:</p>
                        <p className="mt-1 text-muted-foreground">{invoice.notes || 'No narration provided.'}</p>
                    </div>

                    <div className="flex justify-between mt-20 pt-8 border-t">
                        <div className="text-center">
                            <p className="font-semibold">____________________</p>
                            <p>Prepared by</p>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold">____________________</p>
                            <p>Verified by</p>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold">____________________</p>
                            <p>Authorised Signatory</p>
                        </div>
                    </div>
                    <div className="text-center mt-4 text-muted-foreground">
                        <p>◆ End of List ◆</p>
                    </div>
                </footer>
            </div>
             <div className="mt-6 flex justify-center gap-2 no-print">
                 <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
                 <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4"/> Print Invoice</Button>
            </div>
        </div>
    );
};

export default InvoicePage;
