
export interface InvoiceItem {
  id: string | number;
  productId?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CompanyDetails {
  logoUrl?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface LedgerAccount {
    code: string;
    name: string;
    balance: number;
}

export interface Invoice {
  id: string | number;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  companyDetails?: CompanyDetails;
  customerName: string;
  customerAddress?: string;
  customerEmail?: string;
  customerId: string;
  items: InvoiceItem[];
  subTotal: number;
  discountAmount?: number;
  taxAmount?: number;
  taxRate?: number;
  totalAmount: number;
  notes?: string | null;
}
