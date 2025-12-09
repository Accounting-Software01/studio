
'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileBarChart2, Landmark, ArrowRightLeft, Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardOverview, getRecentActivities } from '@/app/dashboard/actions';

interface OverviewData {
    totalRevenue: string;
    netProfit: string;
    totalAssets: string;
    cashBalance: string;
}

interface Activity {
    date: string;
    description: string;
    amount: string;
    type: string;
}

const iconMap = {
    'Total Revenue': <Scale className="w-6 h-6 text-muted-foreground" />,
    'Net Profit': <FileBarChart2 className="w-6 h-6 text-muted-foreground" />,
    'Total Assets': <Landmark className="w-6 h-6 text-muted-foreground" />,
    'Cash Balance': <ArrowRightLeft className="w-6 h-6 text-muted-foreground" />,
};

export default function Home() {
    const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                setError(null);
                const [overview, activityList] = await Promise.all([
                    getDashboardOverview(),
                    getRecentActivities()
                ]);
                setOverviewData(overview);
                setActivities(activityList);
            } catch (e: any) {
                setError('Failed to load dashboard data. Please try again later.');
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const overviewCards = overviewData ? [
        { title: 'Total Revenue', value: overviewData.totalRevenue },
        { title: 'Net Profit', value: overviewData.netProfit },
        { title: 'Total Assets', value: overviewData.totalAssets },
        { title: 'Cash Balance', value: overviewData.cashBalance },
    ] : [];

  return (
    <AppLayout title="Dashboard" description="Welcome back! Here's a summary of your business finances.">
        {error && (
            <Card className="mb-6 bg-destructive/10 text-destructive border-destructive/20">
                <CardHeader className="flex-row items-center gap-4 space-y-0">
                    <AlertCircle className="w-6 h-6" />
                    <div>
                        <CardTitle>Error Loading Dashboard</CardTitle>
                        <CardDescription className="text-destructive/80">{error}</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        )}

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-2/4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-3/4 mb-2" />
                                <Skeleton className="h-3 w-1/2" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    overviewCards.map((card) => (
                        <Card key={card.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                {iconMap[card.title as keyof typeof iconMap]}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.value}</div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
          </TabsContent>
          <TabsContent value="activity">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>A log of the most recent financial activities recorded in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                        </div>
                    ) : activities.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activities.map((activity, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{activity.date}</TableCell>
                                        <TableCell>{activity.description}</TableCell>
                                        <TableCell>
                                            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                                                {activity.type}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">{activity.amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                         <div className="flex justify-center items-center h-40 text-muted-foreground">
                            <p>No recent transactions found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </AppLayout>
  );
}
