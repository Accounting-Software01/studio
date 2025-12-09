
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileBarChart2, Landmark, ArrowRightLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const overviewCards = [
    {
        title: 'Total Revenue',
        value: 'KES 1,250,000',
        change: '+15.2% from last month',
        icon: <Scale className="w-6 h-6 text-muted-foreground" />,
    },
    {
        title: 'Net Profit',
        value: 'KES 280,000',
        change: '+12.1% from last month',
        icon: <FileBarChart2 className="w-6 h-6 text-muted-foreground" />,
    },
     {
        title: 'Total Assets',
        value: 'KES 5,600,000',
        change: '',
        icon: <Landmark className="w-6 h-6 text-muted-foreground" />,
    },
    {
        title: 'Cash Balance',
        value: 'KES 850,000',
        change: '-5.2% from last month',
        icon: <ArrowRightLeft className="w-6 h-6 text-muted-foreground" />,
    }
];

const recentActivities = [
    {
        date: '2024-07-26',
        description: 'Payment Voucher PV-00125 to Supplier X',
        amount: 'KES 45,000.00',
        type: 'Payment'
    },
    {
        date: '2024-07-25',
        description: 'Journal Entry JV-0034 for Payroll',
        amount: 'KES 350,000.00',
        type: 'Journal'
    },
    {
        date: '2024-07-25',
        description: 'Cash sale to Customer Y',
        amount: 'KES 12,500.00',
        type: 'Receipt'
    },
    {
        date: '2024-07-24',
        description: 'Payment for electricity bill',
        amount: 'KES 18,200.00',
        type: 'Payment'
    }
];

export default function Home() {
  return (
    <AppLayout title="Dashboard" description="Welcome back! Here's a summary of your business finances.">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {overviewCards.map((card) => (
                    <Card key={card.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            {card.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <p className="text-xs text-muted-foreground">{card.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="activity">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>A log of the most recent financial activities recorded in the system.</CardDescription>
                </CardHeader>
                <CardContent>
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
                            {recentActivities.map((activity, index) => (
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
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </AppLayout>
  );
}
