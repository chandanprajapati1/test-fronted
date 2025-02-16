'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthCredentials, isAuthenticated } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';

export default function Dashboard() {
  const router = useRouter();
  const { token } = getAuthCredentials();

  useEffect(() => {
    if (isAuthenticated({ token })) {
      router.replace(Routes.Envr);
    } else {
      router.replace(Routes.Envr);
    }
  }, [token, router]);

  // Optionally render a loading state while redirection is in progress
  return <div>Loading...</div>;
}
