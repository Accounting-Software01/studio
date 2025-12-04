
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
      return words.charAt(0).toUpperCase() + words.slice(1) + " Nigerian Naira Only";
    } catch (error) {
      console.error("Error converting amount to words:", error);
      return "Invalid amount";
    }
};

const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(0);
    }
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
};


const InvoicePage = () => {
    const { id: invoiceId } = useParams();
    const router = useRouter();
    const { toast } = useToast();

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [printedDate, setPrintedDate] = useState('');

    const logo = PlaceHolderImages.find(img => img.id === 'company-logo');

    useEffect(() => {
        setPrintedDate(format(new Date(), 'dd-MM-yyyy'));
    }, []);

    const fetchInvoice = useCallback(async () => {
        if (!invoiceId) return;
        setIsLoading(true);
        // This is a mock fetch. Replace with your actual API call.
        setTimeout(() => {
            const mockInvoice: Invoice = {
                id: '1',
                invoiceNumber: 'ANLSALE/33145/2025',
                issueDate: '2025-11-10T00:00:00.000Z',
                companyDetails: {
                    name: 'Aspira Nigeria Ltd-2025',
                    address: 'Km 8, Hadejia Road, Kano, Kano State.',
                },
                customer: {
                    name: 'Auwal Muhd Nasir Ent',
                },
                deliveryNote: 'ANLDN/33145/2025',
                despatchDocumentNo: '2408',
                destination: 'SOKOTO',
                items: [
                    { id: 1, productName: 'Viva Detergent 80g', baseQty: { actual: 1500, billed: 1500 }, altQty: '75,000 Pcs', rate: 7500.00, per: 'Ctn', amount: 11250000.00 },
                    { id: 2, productName: 'Viva Detergent 170g', baseQty: { actual: 2500, billed: 2500 }, altQty: '65,000 Pcs', rate: 7950.00, per: 'Ctn', amount: 19875000.00 },
                    { id: 3, productName: 'Viva Detergent 800g', baseQty: { actual: 500, billed: 500 }, altQty: '3,500 Pcs', rate: 9850.00, per: 'Ctn', amount: 4925000.00 },
                ],
                subTotal: 36050000.00,
                vatAmount: 2703750.00, // 7.5% of subTotal
                totalAmount: 38753750.00, // subTotal + vatAmount
                previousBalance: 1234567.89,
                newBalance: 39988317.89, // totalAmount + previousBalance
                narration: 'Being payment for the supply of detergents.',
            };
            setInvoice(mockInvoice);
            setIsLoading(false);
        }, 1000);
    }, [invoiceId]);

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
    
    const totals = invoice.items.reduce((acc, item) => {
        acc.baseQtyActual += item.baseQty.actual;
        acc.baseQtyBilled += item.baseQty.billed;
        return acc;
    }, { baseQtyActual: 0, baseQtyBilled: 0 });

    const company = invoice.companyDetails;
    const customer = invoice.customer;

    return (
        <div className="bg-gray-100 p-4 sm:p-8 font-sans">
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
                        font-size: 10px;
                    }
                    .no-print {
                        display: none !important;
                    }
                    @page {
                        size: A4;
                        margin: 15mm;
                    }
                }
                .invoice-table th, .invoice-table td {
                    border: 1px solid #000;
                    padding: 0.25rem 0.5rem;
                }
                .invoice-table th {
                    text-align: center;
                    font-weight: bold;
                }
                .border-grid {
                    border: 1px solid #000;
                }
                .border-grid > div {
                    border-bottom: 1px solid #000;
                }
                .border-grid > div:last-child {
                    border-bottom: 0;
                }
                 .border-grid > div > div {
                    padding: 2px 4px;
                }
            `}</style>
            
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg printable-area">
                <header className="mb-4">
                    <div className="flex justify-between items-start pb-4">
                        <div className="w-1/2">
                             {logo && (
                                <div className="mb-2">
                                    <Image
                                        src={'/Aspira-logo.png'}
                                        alt="Company Logo"
                                        width={150}
                                        height={50}
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            <h1 className="text-base font-bold">{company.name}</h1>
                            <p className="text-xs">{company.address}</p>
                        </div>
                        <div className="w-1/2 text-right">
                             <h2 className="text-xl font-bold uppercase">Sales Invoice</h2>
                             <p className="text-xs text-gray-500">Printed by: haidar on {printedDate} (Original)</p>
                        </div>
                    </div>
                     <div className="flex justify-between mt-2 text-xs">
                        <div className="w-1/2 space-y-1">
                            <div className="font-bold">Buyer</div>
                            <div>{customer.name}</div>
                            <div>Terms and Conditions</div>
                        </div>
                        <div className="w-1/2">
                            <div className="border-grid">
                                <div className="grid grid-cols-[auto,1fr,auto,1fr]">
                                    <div className="font-semibold">Invoice No:</div>
                                    <div>{invoice.invoiceNumber}</div>
                                    <div className="font-semibold">Dated:</div>
                                    <div className="text-right">{formatDateSafe(invoice.issueDate)}</div>
                                </div>
                                <div className="grid grid-cols-[auto,1fr,auto,1fr]">
                                    <div className="font-semibold">Delivery Note:</div>
                                    <div>{invoice.deliveryNote}</div>
                                    <div className="font-semibold">Dated:</div>
                                    <div className="text-right">{formatDateSafe(invoice.issueDate)}</div>
                                </div>
                                 <div className="grid grid-cols-[auto,1fr]">
                                    <div className="font-semibold">Other Reference(s):</div>
                                    <div></div>
                                </div>
                                <div className="grid grid-cols-[auto,1fr,auto,1fr]">
                                    <div className="font-semibold">Buyer's Order No.:</div>
                                    <div></div>
                                     <div className="font-semibold">Dated:</div>
                                    <div className="text-right"></div>
                                </div>
                                <div className="grid grid-cols-[auto,1fr,auto,1fr]">
                                    <div className="font-semibold">Despatch Document No.:</div>
                                    <div>{invoice.despatchDocumentNo}</div>
                                    <div className="font-semibold">Destination:</div>
                                    <div className="text-right">{invoice.destination}</div>
                                </div>
                                <div className="grid grid-cols-[auto,1fr]">
                                    <div className="font-semibold">Despatched Through:</div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main>
                    <table className="w-full text-xs text-left invoice-table border-collapse border border-black">
                        <thead>
                            <tr>
                                <th rowSpan={2} className="w-10">S.No</th>
                                <th rowSpan={2} className="w-2/5">Item Description</th>
                                <th colSpan={2}>Base Qty</th>
                                <th rowSpan={2}>Alt Qty</th>
                                <th rowSpan={2}>Rate</th>
                                <th rowSpan={2}>Per</th>
                                <th rowSpan={2}>Disc.%</th>
                                <th rowSpan={2} className="text-right">Amount</th>
                            </tr>
                            <tr>
                                <th>Actual</th>
                                <th>Billed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="text-center">{index + 1}</td>
                                    <td>{item.productName}</td>
                                    <td className="text-center">{item.baseQty.actual}</td>
                                    <td className="text-center">{item.baseQty.billed}</td>
                                    <td className="text-center">{item.altQty}</td>
                                    <td className="text-right">{formatCurrency(item.rate)}</td>
                                    <td className="text-center">{item.per}</td>
                                    <td></td>
                                    <td className="text-right font-medium">{formatCurrency(item.amount)}</td>
                                </tr>
                            ))}
                            {/* Add empty rows to fill up space */}
                             {Array.from({ length: 15 - invoice.items.length }).map((_, i) => (
                                <tr key={`empty-${i}`} style={{height: '28px'}}>
                                    <td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold">
                                <td colSpan={2} className="text-right border-0"></td>
                                <td className="text-center">{totals.baseQtyActual}</td>
                                <td className="text-center">{totals.baseQtyBilled}</td>
                                <td colSpan={4} className="text-right">Sub Total</td>
                                <td className="text-right">{formatCurrency(invoice.subTotal)}</td>
                            </tr>
                             {invoice.vatAmount && (
                                <tr className="font-semibold">
                                    <td colSpan={8} className="text-right">Add: VAT @ 7.5%</td>
                                    <td className="text-right">{formatCurrency(invoice.vatAmount)}</td>
                                </tr>
                            )}
                            <tr className="font-bold text-base">
                                <td colSpan={8} className="text-right">GRAND TOTAL</td>
                                <td className="text-right">{formatCurrency(invoice.totalAmount)}</td>
                            </tr>
                             {invoice.previousBalance && (
                                <tr className="font-semibold">
                                    <td colSpan={8} className="text-right">Previous Balance</td>
                                    <td className="text-right">{formatCurrency(invoice.previousBalance)}</td>
                                </tr>
                            )}
                             {invoice.newBalance && (
                                <tr className="font-bold text-base">
                                    <td colSpan={8} className="text-right">New Balance</td>
                                    <td className="text-right">{formatCurrency(invoice.newBalance)}</td>
                                </tr>
                            )}
                        </tfoot>
                    </table>

                </main>
                
                <footer className="mt-4 text-xs">
                    <div>
                        <p>
                            <span className="font-semibold">Amount In Words:</span>{' '}
                            {convertAmountToWords(invoice.newBalance || invoice.totalAmount)}
                        </p>
                    </div>

                    <div className="mt-4">
                        <p className="font-semibold">Narration:</p>
                        <p className="mt-1 text-gray-600">{invoice.narration || ''}</p>
                    </div>

                    <div className="flex justify-between mt-12 pt-4">
                        <div className="text-center">
                            <p>____________________</p>
                            <p className="font-semibold">Prepared by</p>
                            <p>Naser Najjar</p>
                        </div>
                        <div className="text-center">
                            <p>____________________</p>
                            <p className="font-semibold">Verified by</p>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold">E. & O.E</p>
                        </div>
                        <div className="text-center">
                             <p>____________________</p>
                            <p className="font-semibold">Authorised Signatory</p>
                            <p>Haidar</p>
                        </div>
                    </div>
                     <div className="text-center mt-4 text-gray-500">
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
