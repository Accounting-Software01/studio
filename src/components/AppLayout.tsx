
'use client';
import Link from 'next/link';
import { Library, ArrowLeft } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

export function AppLayout({ children, title, description }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto">
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4 border-b">
                        <div className="flex items-center gap-2">
                           <div className="flex items-center gap-1.5">
                                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                           </div>
                            <div className="flex items-center gap-2 ml-4">
                                <Library className="h-5 w-5 text-primary" />
                                <h1 className="text-base font-semibold">{title}</h1>
                            </div>
                        </div>
                        <Link href="/" passHref>
                             <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-muted-foreground mb-6">{description}</p>
                        <main>{children}</main>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
