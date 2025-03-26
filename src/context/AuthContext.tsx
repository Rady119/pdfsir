'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';

interface AuthContextType {
  user: any;
  loading: boolean;
  error: string | null;
  signIn: (provider?: string) => Promise<void>;
  signUp: (provider?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (provider?: string) => {
    try {
      setError(null);
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    }
  };

  const handleSignUp = async (provider?: string) => {
    try {
      setError(null);
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      await signOut({ callbackUrl: '/' });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      // Implement password reset logic if needed
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Password reset failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        loading: status === 'loading',
        error,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
