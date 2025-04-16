'use client';

import React from 'react';
import TestLayout from '@/components/test/TestLayout';
import { Card } from '@/components/common';
import Link from 'next/link';
import { QrCode, FileText, Send } from 'lucide-react';

const TestHomePage = () => {
  return (
    <TestLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Test Environment</h1>
        <p className="text-gray-600 mb-8">
          Welcome to the MindTrack test environment. This area allows you to test questionnaires
          without authentication. You can generate QR codes, view questionnaires, and submit responses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <Link href="/test/generate" className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Generate QR Code</h2>
              <p className="text-gray-600 text-sm">
                Create QR codes for your questionnaires that can be scanned by users.
              </p>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow">
            <Link href="/test/questionnaires" className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Questionnaires</h2>
              <p className="text-gray-600 text-sm">
                View and test available questionnaires from Google Forms.
              </p>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow">
            <Link href="/test/responses" className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Send className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Responses</h2>
              <p className="text-gray-600 text-sm">
                View responses submitted through the test environment.
              </p>
            </Link>
          </Card>
        </div>

        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">About Test Environment</h3>
          <p className="text-yellow-700">
            This environment uses separate database tables (testquestionnaire, testquestion, testresponse)
            to store data. No authentication is required, making it perfect for testing and demonstrations.
          </p>
        </div>
      </div>
    </TestLayout>
  );
};

export default TestHomePage;
