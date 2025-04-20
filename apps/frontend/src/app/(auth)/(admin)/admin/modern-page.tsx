'use client';

import React from 'react';
import ModernLayout from './modern-layout';
import ModernDashboard from './modern-dashboard';

const ModernAdminPage: React.FC = () => {
  return (
    <ModernLayout>
      <ModernDashboard />
    </ModernLayout>
  );
};

export default ModernAdminPage;
