import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

export default function Onboarding() {
  const { loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after login/onboarding
    if (!loading) {
      router.push('/');
    }
  }, [loading, router]);

  return null;
}

