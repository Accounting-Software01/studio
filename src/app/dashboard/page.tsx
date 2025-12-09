'use client';

import React from 'react';
import { Card, CardDescription, CardContent, CardTitle } from "@/components/ui/card";
import { AppLayout } from '@/components/AppLayout';


export default function DashboardPage() {
  return (
    <AppLayout
        title="Dashboard"
        description="Welcome to your financial command center."
    >
       <div className="flex flex-col items-center justify-center h-full text-center">
            <CardTitle className="text-2xl mb-2">Welcome to ClearBooks</CardTitle>
            <CardDescription>
                You can manage all your accounting tasks from here. Use the sidebar to navigate to different sections of the application.
            </CardDescription>
        </div>
    </AppLayout>
  );
}
