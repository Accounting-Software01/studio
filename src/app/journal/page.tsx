
'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { PlusCircle, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JournalEntryLine {
    id: number;
    accountId: string;
    debit: number;
    credit: number;
}

const chartOfAccounts = [
    { code: '101100', name: 'Cash at Bank - Main Account' },
    { code: '101110', name: 'Cash at Bank - Operations Account' },
    { code: '101120', name: 'Cash at Bank - Sales Collection Account' },
    { code: '101130', name: 'Cash at Hand - Head Office' },
    { code: '101140', name: 'Cash at Hand - Factory' },
    { code: '101150', name: 'Cash at Hand - Depot/Branches' },
    { code: '101200', name: 'Trade Receivables - Customers' },
    { code: '101210', name: 'Accounts Receivable Control (AUTO)' },
    { code: '101220', name: 'Staff Debtors' },
    { code: '101230', name: 'Other Receivables' },
    { code: '101240', name: 'Prepayments - Insurance' },
    { code: '101250', name: 'Prepayments - Rent' },
    { code: '101260', name: 'Prepayments - Other' },
    { code: '101300', name: 'Inventory - Raw Materials' },
    { code: '101310', name: 'Inventory Control - Raw Materials (AUTO)' },
    { code: '101320', name: 'Inventory - Work-in-Progress' },
    { code: '101330', name: 'Inventory Control - WIP (AUTO)' },
    { code: '101340', name: 'Inventory - Finished Goods' },
    { code: '101350', name: 'Inventory Control - Finished Goods (AUTO)' },
    { code: '101360', name: 'Inventory - Packaging Materials' },
    { code: '101370', name: 'Inventory - Spare Parts & Consumables' },
    { code: '101400', name: 'Inter-Branch Receivable (AUTO)' },
    { code: '101410', name: 'Withholding Tax Receivable' },
    { code: '101420', name: 'VAT Refundable (Input VAT)' },
    { code: '101430', name: 'Deposits with Suppliers' },
    { code: '102100', name: 'Property, Plant & Equipment Control (AUTO)' },
    { code: '102110', name: 'Land' },
    { code: '102120', name: 'Buildings - Factory' },
    { code: '102130', name: 'Buildings - Administrative' },
    { code: '102140', name: 'Plant & Machinery - Production Lines' },
    { code: '102150', name: 'Borehole & Water Treatment Facilities' },
    { code: '102160', name: 'Factory Generators' },
    { code: '102170', name: 'Motor Vehicles - Distribution' },
    { code: '102180', name: 'Office Equipment' },
    { code: '102190', name: 'Furniture & Fixtures' },
    { code: '102200', name: 'Capital Work-in-Progress (CWIP)' },
    { code: '102300', name: 'Intangible Assets - Software' },
    { code: '102310', name: 'Accumulated Depreciation - Buildings' },
    { code: '102320', name: 'Accumulated Depreciation - Plant & Machinery' },
    { code: '102330', name: 'Accumulated Depreciation - Motor Vehicles' },
    { code: '102340', name: 'Accumulated Depreciation - Office Equipment' },
    { code: '102350', name: 'Impairment Loss Assets' },
    { code: '201010', name: 'Accounts Payable Control (AUTO)' },
    { code: '201020', name: 'Trade Creditors - Suppliers' },
    { code: '201030', name: 'Accrued Expenses' },
    { code: '201040', name: 'Accrued Payroll' },
    { code: '201110', name: 'Payroll Control Account (AUTO)' },
    { code: '201210', name: 'VAT Output Payable' },
    { code: '201220', name: 'VAT Input Offset' },
    { code: '201230', name: 'PAYE Tax Payable' },
    { code