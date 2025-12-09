
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

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl animate-zoom-in-fade">
        <Card className="overflow-hidden rounded-lg shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 bg-muted/50 hidden md:flex flex-col justify-center items-center text-center">
              <Library className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold">Accounting Hub</h2>
              <p className="text-muted-foreground mt-2">
                Your comprehensive financial command center.
              </p>
            </div>
            <div className="p-8">
              <CardHeader className="text-center p-0 mb-6">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid gap-4">
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
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" className="underline">
                    Sign up
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
