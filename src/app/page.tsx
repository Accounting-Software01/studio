import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, BookPlus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex gap-4 mb-6">
          <div className="bg-primary p-4 rounded-full">
            <FileText className="h-12 w-12 text-primary-foreground" />
          </div>
          <div className="bg-secondary p-4 rounded-full">
            <BookOpen className="h-12 w-12 text-secondary-foreground" />
          </div>
           <div className="bg-accent p-4 rounded-full">
            <BookPlus className="h-12 w-12 text-accent-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">
          Accounting Hub
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mb-8">
          Manage your invoices, view your general ledger, and record journal entries with ease.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/invoice/1">View Sample Invoice</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/ledger">Go to General Ledger</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/journal">Create Journal Entry</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}