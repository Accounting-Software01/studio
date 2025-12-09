
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  description: string;
}

export function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="bg-background sticky top-0 z-10 border-b">
        <div className="container mx-auto px-4 sm:px-8">
            <div className="flex items-center justify-between h-16">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-primary">{title}</h1>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    </header>
  );
}
