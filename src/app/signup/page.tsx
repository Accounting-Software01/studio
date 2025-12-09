
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Library } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl animate-zoom-in-fade">
        <Card className="overflow-hidden rounded-lg shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
             <div className="p-8 bg-muted/50 hidden md:flex flex-col justify-center items-center text-center">
              <Library className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold">Accounting Hub</h2>
              <p className="text-muted-foreground mt-2">
                Create an account to manage your finances.
              </p>
            </div>
            <div className="p-8">
                <CardHeader className="text-center p-0 mb-6">
                    <CardTitle className="text-2xl">Create an Account</CardTitle>
                    <CardDescription>
                    Enter your information to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input id="full-name" placeholder="John Doe" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">
                        Create Account
                    </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="underline">
                        Login
                    </Link>
                    </div>
                </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
