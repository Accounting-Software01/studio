
'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Placeholder data - replace with API call
const customers = [
  { id: 'CUS001', name: 'Creative Solutions LLC', contactPerson: 'Emily White', email: 'emily.white@creativesolutions.com', phone: '555-234-5678' },
  { id: 'CUS002', name: 'Innovate Inc.', contactPerson: 'Michael Brown', email: 'michael.brown@innovate.com', phone: '555-876-5432' },
  { id: 'CUS003', name: 'Dynamic Enterprises', contactPerson: 'Sarah Green', email: 'sarah.green@dynamic.com', phone: '555-111-2222' },
];

const CustomersPage = () => {
  return (
    <AppLayout
      title="Customer Profiles"
      description="Manage your list of customers and their contact information."
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle>All Customers</CardTitle>
                <CardDescription>A list of all your company's customers.</CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Customer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-mono">{customer.id}</TableCell>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.contactPerson}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default CustomersPage;
