
'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ItemSelectionDialog } from './ItemSelectionDialog';

interface InventoryItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'finished' | 'raw';
  onSuccess: () => void;
}

export function InventoryItemDialog({ open, onOpenChange, mode, onSuccess }: InventoryItemDialogProps) {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitCost, setUnitCost] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isItemSelectionOpen, setIsItemSelectionOpen] = useState(false);

    const title = mode === 'finished' ? 'Add Finished Good' : 'Add Raw Material';
    const description = mode === 'finished' 
        ? 'This will record a new finished good and automatically create a journal entry.'
        : 'This will record a new raw material and automatically create a journal entry.';
    const endpoint = mode === 'finished' 
        ? 'https://hariindustries.net/busa-api/database/add-finished-good.php'
        : 'https://hariindustries.net/busa-api/database/add-raw-material.php';

    const resetForm = () => {
        setName('');
        setQuantity('');
        setUnitCost('');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const parsedQuantity = parseInt(quantity, 10);
        const parsedUnitCost = parseFloat(unitCost);

        if (!name || isNaN(parsedQuantity) || isNaN(parsedUnitCost) || parsedQuantity <= 0 || parsedUnitCost <= 0) {
            toast({
                variant: 'destructive',
                title: 'Invalid Input',
                description: 'Please fill out all fields with valid numbers.',
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, quantity: parsedQuantity, unitCost: parsedUnitCost }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to add item.');
            }

            toast({
                title: 'Success!',
                description: `${name} has been added to inventory and the journal has been posted.`,
            });
            
            resetForm();
            onSuccess(); // Callback to refresh the table
            onOpenChange(false); // Close the dialog

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Operation Failed',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ItemSelectionDialog
                open={isItemSelectionOpen}
                onOpenChange={setIsItemSelectionOpen}
                type={mode === 'finished' ? 'product' : 'material'}
                onSelectItem={(itemName) => {
                    setName(itemName);
                    setIsItemSelectionOpen(false);
                }}
            />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>{description}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <div className="col-span-3 flex gap-2">
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Type or select a name" />
                                    <Button type="button" variant="outline" size="icon" onClick={() => setIsItemSelectionOpen(true)}>
                                        <UserPlus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="quantity" className="text-right">Quantity</Label>
                                <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="col-span-3" placeholder="e.g., 1500" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="unitCost" className="text-right">Unit Cost</Label>
                                <Input id="unitCost" type="number" step="0.01" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} className="col-span-3" placeholder="e.g., 50.00" />
                            </div>
                        </div>
                        <DialogFooter>
                             <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Item
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
