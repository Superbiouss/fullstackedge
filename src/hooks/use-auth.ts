'use client';

import { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/types';

export type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
});

export const useAuth = () => {
  return useContext(AuthContext);
};
