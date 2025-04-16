'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRoles?: string[];
};

/**
 * A component that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 * Optionally checks for required roles
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = []
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authentication check is complete and user is not logged in
    if (!isLoading && !user) {
      router.push('/login');
    }

    // If user is logged in but doesn't have required role
    if (
      !isLoading &&
      user &&
      requiredRoles.length > 0 &&
      !requiredRoles.includes(user?.role)
    ) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router, requiredRoles]);

  // Show nothing while loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated and has required role, render children
  if (user && (requiredRoles.length === 0 || requiredRoles.includes(user?.role))) {
    return <>{children}</>;
  }

  // Otherwise render nothing
  return null;
};

export default ProtectedRoute;
