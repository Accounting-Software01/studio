'use client';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getCurrentUser, logout } from '@/lib/auth';
import { Sidebar } from '@/components/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

const useUser = () => {
    const [user, setUser] = useState<{ uid: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            setIsLoading(false);
        };
        checkUser();
    }, []);

    return { user, isLoading };
};

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/payment-voucher/new', label: 'New Payment', icon: 'FilePlus' },
    { href: '/journal', label: 'Journal Entry', icon: 'BookPlus' },
    { href: '/ledger', label: 'General Ledger', icon: 'BookOpen' },
    { href: '/trial-balance', label: 'Trial Balance', icon: 'Scale' },
    { href: '/profit-loss', label: 'Profit & Loss', icon: 'FileBarChart2' },
    { href: '/balance-sheet', label: 'Balance Sheet', icon: 'Landmark' },
    { href: '/cash-flow', label: 'Cash Flow', icon: 'ArrowRightLeft' },
    { href: '/customers', label: 'Customers', icon: 'UserSquare' },
    { href: '/suppliers', label: 'Suppliers', icon: 'Users' },
];


export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };
    
    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    const currentNavItem = navItems.find(item => item.href === pathname);
    const title = currentNavItem?.label || 'ClearBooks';


    return (
        <div className="relative z-10 flex min-h-screen w-full h-screen p-4 gap-4">
            <Sidebar />
            <main className="flex-1 flex flex-col">
                <Card className="w-full flex flex-col flex-grow shadow-2xl bg-card/80 backdrop-blur-xl">
                    <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-2">
                           <div className="flex items-center gap-1.5">
                                <Link href="/dashboard" className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"></Link>
                                <button className="h-3 w-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"></button>
                                <button className="h-3 w-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"></button>
                           </div>
                            <div className="flex items-center gap-2 ml-4">
                                <h1 className="text-base font-semibold">{title}</h1>
                            </div>
                        </div>
                         <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </CardHeader>
                    <ScrollArea className="flex-grow">
                         <CardContent className="p-6">
                            {children}
                        </CardContent>
                    </ScrollArea>
                </Card>
            </main>
        </div>
    );
}
