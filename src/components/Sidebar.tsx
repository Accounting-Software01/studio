'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    FilePlus, 
    BookPlus, 
    BookOpen, 
    Scale, 
    FileBarChart2, 
    Landmark, 
    ArrowRightLeft, 
    Users, 
    UserSquare,
    Library
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/payment-voucher/new', label: 'New Payment', icon: FilePlus },
    { href: '/journal', label: 'Journal Entry', icon: BookPlus },
    { href: '/ledger', label: 'General Ledger', icon: BookOpen },
    { href: '/trial-balance', label: 'Trial Balance', icon: Scale },
    { href: '/profit-loss', label: 'Profit & Loss', icon: FileBarChart2 },
    { href: '/balance-sheet', label: 'Balance Sheet', icon: Landmark },
    { href: '/cash-flow', label: 'Cash Flow', icon: ArrowRightLeft },
    { href: '/customers', label: 'Customers', icon: UserSquare },
    { href: '/suppliers', label: 'Suppliers', icon: Users },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 flex-shrink-0 rounded-2xl bg-primary/10 backdrop-blur-lg border border-white/10 shadow-lg flex flex-col">
            <div className="p-6 flex items-center justify-center gap-2 border-b border-white/10">
                <Library className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-primary">ClearBooks</h2>
            </div>
            <ScrollArea className="flex-grow">
                <nav className="py-4 px-4">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link 
                                    href={item.href} 
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 text-muted-foreground hover:bg-card hover:text-primary",
                                        pathname === item.href && "bg-card text-primary font-semibold shadow-md"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </ScrollArea>
            <div className="p-4 border-t border-white/10 text-center text-xs text-gray-400">
                <p>&copy; 2024 ClearBooks</p>
            </div>
        </aside>
    );
}
