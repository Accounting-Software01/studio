import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center text-center">
        <div className="bg-primary p-4 rounded-full mb-6">
          <FileText className="h-12 w-12 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">
          Invoice Assistant
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mb-8">
          View, manage, and print your professional invoices with ease. Click below to see how it works.
        </p>
        <Button asChild size="lg">
          <Link href="/invoice/1">View Sample Invoice</Link>
        </Button>
      </div>
    </main>
  );
}
