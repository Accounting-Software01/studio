
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
const suppliers = [
  { id: 'SUP001', name: 'Global Tech Imports', contactPerson: 'Jane Doe', email: 'jane.doe@globaltech.com', phone: '555-123-4567' },
  { id: 'SUP002', name: 'Office Supply Co.', contactPerson: 'John Smith', email: 'john.smith@officesupply.com', phone: '555-987-6543' },
  { id: 'SUP003', name: 'Industrial Materials Inc.', contactPerson: 'Peter Jones', email: 'peter.jones@industrial.com', phone: '555-555-5555' },
];

const SuppliersPage = () => {
  return (
    <AppLayout
      title="Supplier Profiles"
      description="Manage your list of suppliers and their contact information."
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle>All Suppliers</CardTitle>
                <CardDescription>A list of all your company's suppliers.</CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Supplier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier ID</TableHead>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-mono">{supplier.id}</TableCell>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default SuppliersPage;
