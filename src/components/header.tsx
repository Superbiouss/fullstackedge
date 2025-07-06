'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { Logo } from './logo';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Crown } from 'lucide-react';

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAdmin = user?.uid === process.env.NEXT_PUBLIC_FIREBASE_ADMIN_UID;

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <header className="py-4 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Logo />
        <nav>
          {loading ? (
            <div className="h-10 w-24 bg-muted rounded-md animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              {isAdmin && (
                <Button asChild variant="ghost" style={{ color: 'hsl(var(--primary))' }} className="hover:text-primary">
                  <Link href="/admin">
                    <Crown className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
