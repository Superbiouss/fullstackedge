'use client';

import { auth } from '@/lib/firebase';
import { AuthContext, AuthContextType } from '@/hooks/use-auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useState, useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
