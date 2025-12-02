export interface InvoiceItem {
  id: string | number;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitOfMeasure: string;
  totalPrice: number;
}

export interface CompanyDetails {
  logoUrl?: string;
  name: string;
  address: string;
}

export interface Customer {
  name: string;
}

export interface Balances {
  previousBalance: number | null;
  newBalance: number | null;
}

export interface Invoice {
  id: string | number;
  invoiceNumber: string;
  issueDate: string; // ISO date string
  companyDetails: CompanyDetails;
  customer: Customer;
  items: InvoiceItem[];
  subTotal: number;
  discountAmount: number | null;
  taxAmount: number;
  totalAmount: number;
  notes?: string | null;
  balances?: Balances | null;
}
