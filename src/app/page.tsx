import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen } from "lucide-react";
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
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">
          Accounting Hub
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mb-8">
          Manage your invoices and view your general ledger with ease.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/invoice/1">View Sample Invoice</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/ledger">Go to General Ledger</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
