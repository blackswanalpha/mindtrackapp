'use client';

import React from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRoles?: string[];
};

/**
 * AUTHENTICATION DISABLED
 * This component previously protected routes requiring authentication
 * Now it simply renders children without any checks
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Simply render children without any authentication checks
  return <>{children}</>;
};

export default ProtectedRoute;
