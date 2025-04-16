'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ResponseList from '@/components/response/ResponseList';

const ResponsesPage = () => {
  return (
    <DashboardLayout>
      <ResponseList />
    </DashboardLayout>
  );
};

export default ResponsesPage;
