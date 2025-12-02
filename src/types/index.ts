
export interface InvoiceItem {
  id: string | number;
  productName: string;
  baseQty: {
    actual: number;
    billed: number;
  };
  altQty: string;
  rate: number;
  per: string;
  disc?: number;
  amount: number;
}

export interface CompanyDetails {
  logoUrl?: string;
  name: string;
  address: string;
}

export interface Customer {
  name: string;
}

export interface Invoice {
  id: string | number;
  invoiceNumber: string;
  issueDate: string; // ISO date string
  deliveryNote: string;
  despatchDocumentNo: string;
  destination: string;
  companyDetails: CompanyDetails;
  customer: Customer;
  items: InvoiceItem[];
  totalAmount: number;
  narration?: string | null;
}

    