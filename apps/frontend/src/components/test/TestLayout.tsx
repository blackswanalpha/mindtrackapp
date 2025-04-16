'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, QrCode, FileText, Send } from 'lucide-react';

type TestLayoutProps = {
  children: React.ReactNode;
};

/**
 * TestLayout component for public questionnaire pages
 * This layout doesn't require authentication
 */
const TestLayout: React.FC<TestLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-blue-600 font-bold text-xl">MindTrack</span>
                <span className="ml-2 text-gray-500 text-sm">Test</span>
              </Link>
            </div>
            <div>
              <Link href="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-12">
            <Link 
              href="/test" 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === '/test' 
                  ? 'border-blue-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
            <Link 
              href="/test/generate" 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === '/test/generate' 
                  ? 'border-blue-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR
            </Link>
            <Link 
              href="/test/questionnaires" 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname?.startsWith('/test/questionnaires') 
                  ? 'border-blue-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="mr-2 h-4 w-4" />
              Questionnaires
            </Link>
            <Link 
              href="/test/responses" 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname?.startsWith('/test/responses') 
                  ? 'border-blue-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Send className="mr-2 h-4 w-4" />
              Responses
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            MindTrack Test Environment - No authentication required
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TestLayout;
