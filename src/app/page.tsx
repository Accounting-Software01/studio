'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// This is a placeholder for the actual useUser hook from Firebase
// We will replace this with the real implementation later.
const useUser = () => {
    const [user, setUser] = useState<{ uid: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate checking for a user session.
        const session = null; // Set to a mock user object to test authenticated state
        setTimeout(() => {
            // setUser(session || { uid: 'mock-user' }); // Uncomment to test with a logged-in user
            setUser(session); // Default to logged-out state
            setIsLoading(false);
        }, 500);
    }, []);

    return { user, isLoading };
};


export default function RootPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, user, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
